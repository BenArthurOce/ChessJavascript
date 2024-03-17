
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
            for row in csvreader:
                # key = row['PGN']

                key = re.sub(r'\.\s+', '.', row['PGN'])     #Remove the empty spaces in front of the dot points
                eco = row['ECO']
                name = row['NAME']
                board = row['BOARD']


        # Transpose CSV Contents into Dictionary
                self[key] = {
                     'ECO': eco
                    ,'VOLUME': eco[0]
                    ,'NAME': name
                    ,'PGN': key
                    ,'MOVESSTRING': None
                    ,'NUMMOVES': None
                    ,'NEXTTOMOVE': None
                    ,'FAVOURITE': None
                    ,'ISERROR': None
                    ,'FAMILY': None
                    ,'VARIATION': None

                    # ,'BOARDSTRING': board.replace("[", "").replace("]", "").split(",")
                }


                #
                # REGEX
                #
                regexPattern = r'\s*(\d{1,3})\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)(?:\s*\d+\.?\d+?m?s)?\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)?(?:\s*\d+\.?\d+?m?s)?'
                matches = re.findall(regexPattern, self[key]['PGN'])


                ##
                ##  MOVESSTRING
                ##
                formatted_data = ''
                formatted_game = ''
                for move in matches:
                    formatted_move = "{" + " || ".join(move) + "}, "
                    formatted_game += formatted_move
                formatted_data += "[" + formatted_game[:-2] + "]"
                self[key]['MOVESSTRING'] = formatted_data

                ##
                ##  NUMMOVES
                ##
                #Use the parser regx to determine the last move number of each PGN
                last_move_number = int(matches[-1][0])
                self[key]['NUMMOVES'] = last_move_number


                ##
                ##  NEXTTOMOVE
                ##
                #Use the parser regx to determine which player is next to move
                final_move = matches[-1][2]
                if final_move == '':
                    self[key]['NEXTTOMOVE'] = "Black"
                else:
                    self[key]['NEXTTOMOVE'] = "White"


                ##
                ##  FAMILY / VARIATION / SUBVARIATION
                ##

                split_test = re.split(': |; ', self[key]['NAME'])

                try:
                    self[key]['FAMILY'] = split_test[0]
                except IndexError:
                    self[key]['FAMILY'] = None  # or any other default value
                
                try:
                    self[key]['VARIATION'] = split_test[1]
                except IndexError:
                    self[key]['VARIATION'] = None  # or any other default value
                
                try:
                    self[key]['SUBVARIATION'] = split_test[2]
                except IndexError:
                    self[key]['SUBVARIATION'] = None  # or any other default value


                ##
                ##  CASTLING
                ##
                if "O-O-O" in self[key]['PGN']:
                    self[key]['CASTLING'] = "Yes"
                elif "O-O" in self[key]['PGN']:
                    self[key]['CASTLING'] = "Yes"
                else:
                    self[key]['CASTLING'] = None




mydict = OpeningsDict()
for (key, value) in mydict.items():
    print(value)



def create_json_file(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

create_json_file(mydict, 'openings_data.json')
