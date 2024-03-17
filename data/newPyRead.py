import pandas as pd

# File path
file_path = r'C:\Users\ben.arthur\Visual Studio Code\Javascript\Chess\data\2024.03.08_chessCSV.csv'

def read_csv(file_path):
    try:
        # Read CSV file into a pandas DataFrame
        df = pd.read_csv(file_path)

        # Display the DataFrame
        print(df)

        # Access specific columns (PGN, ECO, NAME)
        pgn_column = df['PGN']
        eco_column = df['ECO']
        name_column = df['NAME']

        # Displaying the specific columns
        print("PGN column:")
        print(pgn_column)

        print("ECO column:")
        print(eco_column)

        print("NAME column:")
        print(name_column)

        return df

    except FileNotFoundError:
        print(f"File not found at {file_path}")

# Calling the function to read the CSV
read_csv(file_path)
