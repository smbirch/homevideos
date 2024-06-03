import re

input_file = "data.sql"
output_file = "output.sql"

with open(input_file, "r") as f:
    sql_content = f.read()

pattern = r"INSERT INTO video \(url, title, thumbnailurl, filename\) VALUES \((.*?)\);"

def add_description(match):
    values = match.group(1)
    modified_values = f"{values}, 'test description'"
    return f"INSERT INTO video (url, title, thumbnailurl, filename, description) VALUES ({modified_values});\n"

modified_sql = re.sub(pattern, add_description, sql_content)

with open(output_file, "w") as f:
    f.write(modified_sql)

print("SQL file has been created successfully")