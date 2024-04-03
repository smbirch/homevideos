import re

# Define the input and output file paths
input_file = "data.sql"
output_file = "output.sql"

# Read the SQL file
with open(input_file, "r") as f:
    sql_content = f.read()

# Define a regular expression pattern to match INSERT statements
pattern = r"INSERT INTO video \(url, title, thumbnailurl, filename\) VALUES \((.*?)\);"

# Function to modify each INSERT statement
def add_description(match):
    values = match.group(1)
    modified_values = f"{values}, 'This is the description'"  # Adding description
    return f"INSERT INTO video (url, title, thumbnailurl, filename, description) VALUES ({modified_values});\n"

# Add description to each INSERT statement
modified_sql = re.sub(pattern, add_description, sql_content)

# Write the modified SQL to a new file
with open(output_file, "w") as f:
    f.write(modified_sql)

print("Modified SQL file has been created successfully!")