import os
import sys
import subprocess
import argparse
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('deployment.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class Deployer:
    def __init__(self, project_path='/opt/homevideos', repo_url=None):
        """
        Initialize the deployer with project details

        :param project_path: Path where the project will be deployed
        :param repo_url: GitHub repository URL (optional)
        """
        self.project_path = project_path
        self.repo_url = repo_url

    def run_command(self, command, cwd=None, capture_output=False):
        """
        Run a shell command with error handling

        :param command: Command to run
        :param cwd: Working directory
        :param capture_output: Whether to capture command output
        :return: Command output or None
        """
        try:
            logger.info(f"Running command: {command}")
            result = subprocess.run(
                command,
                shell=True,
                check=True,
                cwd=cwd or self.project_path,
                capture_output=capture_output,
                text=True
            )
            return result.stdout if capture_output else None
        except subprocess.CalledProcessError as e:
            logger.error(f"Command failed: {e}")
            logger.error(f"Error output: {e.stderr}")
            raise

    def clone_repository(self):
        """
        Clone or update the repository
        """
        if not self.repo_url:
            logger.info("No repository URL provided. Skipping clone.")
            return

        if os.path.exists(os.path.join(self.project_path, '.git')):
            # If repo already exists, pull latest
            self.run_command('git fetch origin && git reset --hard origin/main')
        else:
            # Clone repository
            os.makedirs(self.project_path, exist_ok=True)
            self.run_command(f'git clone {self.repo_url} .')

    def create_backup(self):
        """
        Create a backup of the current deployment
        """
        backup_dir = os.path.join(
            self.project_path,
            f'backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}'
        )
        self.run_command(f'cp -R {self.project_path} {backup_dir}')
        logger.info(f"Backup created at {backup_dir}")

    def deploy(self, rebuild=True, backup=True):
        """
        Deploy the application

        :param rebuild: Rebuild docker containers
        :param backup: Create backup before deployment
        """
        try:
            if backup:
                self.create_backup()

            # Pull latest changes
            self.clone_repository()

            # Stop existing containers
            self.run_command('docker-compose down')

            # Rebuild if specified
            if rebuild:
                self.run_command('docker-compose build')

            # Start containers
            self.run_command('docker-compose up -d')

            # Prune old images and containers
            self.run_command('docker system prune -f')

            logger.info("Deployment successful!")

        except Exception as e:
            logger.error(f"Deployment failed: {e}")
            # Optionally, rollback to last known good state
            raise

    def rollback(self, backup_dir=None):
        """
        Rollback to a previous deployment

        :param backup_dir: Specific backup directory to rollback to
        """
        if not backup_dir:
            # Find the most recent backup
            backups = [
                d for d in os.listdir(self.project_path)
                if d.startswith('backup_')
            ]
            if not backups:
                logger.error("No backups found")
                return

            backup_dir = os.path.join(
                self.project_path,
                sorted(backups, reverse=True)[0]
            )

        logger.info(f"Rolling back to {backup_dir}")

        # Stop current containers
        self.run_command('docker-compose down')

        # Replace current deployment with backup
        self.run_command(f'rm -rf {self.project_path}/*')
        self.run_command(f'cp -R {backup_dir}/* {self.project_path}/')

        # Restart containers
        self.run_command('docker-compose up -d')

        logger.info("Rollback complete")

def main():
    parser = argparse.ArgumentParser(description='Automated Deployment Script')
    parser.add_argument('--repo', help='GitHub repository URL')
    parser.add_argument('--path', default='/opt/homevideos', help='Deployment path')
    parser.add_argument('--rollback', action='store_true', help='Rollback to last backup')
    parser.add_argument('--no-rebuild', action='store_false', dest='rebuild', help='Skip rebuilding containers')
    parser.add_argument('--no-backup', action='store_false', dest='backup', help='Skip creating backup')

    args = parser.parse_args()

    deployer = Deployer(project_path=args.path, repo_url=args.repo)

    if args.rollback:
        deployer.rollback()
    else:
        deployer.deploy(rebuild=args.rebuild, backup=args.backup)

if __name__ == '__main__':
    main()
