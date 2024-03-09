
import csv
import re
import json


#This class reads a chess CSV and creates a dictionary
class OpeningsDict(dict):
    def __init__(self, *arg, **kw):
        super(OpeningsDict, self).__init__(*arg, **kw)
        self.read_from_csv_file()  # Call the method at the end of the __init__ method

    def read_from_csv_file(self):
        # csv_filename = r"C:\Users\ben.arthur\Visual Studio Code\Javascript\Chess\chessOpenings.csv"
        csv_filename = r"C:\Users\ben.arthur\Visual Studio Code\Javascript\Chess\data\chessCSVWithPositions.csv"
        # C:\Users\ben.arthur\Visual Studio Code\Javascript\Chess\data\2024.03.08_chessCSV.csv

        # Open CSV and read
        with open(csv_filename) as csvfile:
            csvreader = csv.DictReader(csvfile)
            print(csvreader)
            for row in csvreader:
                key = row['PGN']
                eco = row['ECO']
                name = row['NAME']
                board = row['BOARD']


        # Transpose CSV Contents into Dictionary
                self[key] = {  
                    #  'VOLUME': volume
                     'ECO': eco
                    ,'VOLUME': eco[0]
                    ,'NAME': name
                    ,'PGN': key
                    ,'NUMMOVES': None
                    ,'FAVOURITE': None
                    ,'ISERROR': None
                    ,'BOARDSTRING': board.replace("[", "").replace("]", "").split(",")
                }

                #Use the parser regx to determine the last move number of each PGN
                regexPattern = r'\s*(\d{1,3})\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)(?:\s*\d+\.?\d+?m?s)?\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)?(?:\s*\d+\.?\d+?m?s)?'
                matches = re.findall(regexPattern, self[key]['PGN'])
                last_move_number = int(matches[-1][0])

                # store that last move number in the dictionary
                self[key]['NUMMOVES'] = last_move_number


mydict = OpeningsDict()
print(mydict)



def create_json_file(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

create_json_file(mydict, 'openings_data.json')
