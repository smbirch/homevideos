import os

def create_sql_insert(filepath, title):
    return f"INSERT INTO Video (url, title) VALUES ('{filepath}', '{title}');\n"

def main():
    directory = "/Users/spencerbirch/Documents/Code/Java/homemovies/src/main/resources/static"
    sql_filename = "insert_videos.sql"
    sql_file = open(sql_filename, "w")

    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        title, _ = os.path.splitext(filename)
        sql_query = create_sql_insert(filepath, title)
        sql_file.write(sql_query)

    sql_file.close()
    print(f"SQL file '{sql_filename}' has been created successfully.")

if __name__ == "__main__":
    main()