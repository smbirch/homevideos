
# Home Videos Overview
In 2024 my mom had all of our old family videos digitized. These were delivered to her over an FTP share and she was completely lost on how to even get them.
I created this site as a way for my family to more easily view and chat about these memories.

## Technology
Next.js / Spring Boot / Postgres / Redis / S3 / Digital Ocean / Cloudfront

Originally I created this site using Angular and recently swapped over to Nextjs for a learning opportunity.
The video files themselves are stored in S3 and served with the help of Cloudfront. These are accessed by URLs stored in Postgres and streamed to the user. 
Login and sessions are secured using bcrypt and JWTs and are blacklisted upon logout, expiration, or account deletion in Redis.
The site is hosted in a Digital Ocean droplet as a subdomain of smbirch.com. I use NGINX to assist with proxying and some caching. 

## License
[MIT](https://choosealicense.com/licenses/mit/)
