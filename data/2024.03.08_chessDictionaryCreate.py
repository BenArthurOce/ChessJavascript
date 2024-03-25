
import csv
import re
import json


# Constants
CSV_FILE_PATH = r"C:\Users\ben.arthur\Visual Studio Code\Javascript\Chess\data\chessCSVWithPositions.csv"

# Compiled regex pattern
MOVE_REGEX  = r'\s*(\d{1,3})\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)(?:\s*\d+\.?\d+?m?s)?\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)?(?:\s*\d+\.?\d+?m?s)?'



#This class reads a chess CSV and creates a dictionary
class OpeningsDict(dict):
    def __init__(self, *arg, **kw):
        super(OpeningsDict, self).__init__(*arg, **kw)
        self.read_from_csv_file()  # Call the method at the end of the __init__ method

    def read_from_csv_file(self):
        with open(CSV_FILE_PATH) as csvfile:
            csvreader = csv.DictReader(csvfile)
            opening_id = 1  # Initialize opening ID counter
            for row in csvreader:
                key = re.sub(r'\.\s+', '.', row['PGN'])     # Column A = "PGN"
                eco = row['ECO']                            # Column B = "ECO"
                name = row['NAME']                          # Column C = "NAME"
                board = row['BOARD']                        # Column D = "BOARD"

        # Transpose CSV Contents into Dictionary
                self[key] = {
                     'ID': opening_id
                    ,'ECO': eco
                    ,'VOLUME': eco[0]
                    ,'NAME': name
                    ,'PGN': key
                    ,'MOVESSTRING': None
                    ,'BOARDSTRING': None
                    ,'NUMMOVES': None
                    ,'NEXTTOMOVE': None
                    ,'FAMILY': None
                    ,'VARIATION': None
                    ,'SUBVARIATION': None
                    ,'CHECKMATE': None
                    ,'CASTLINGWHITE': None
                    ,'CASTLINGBLACK': None
                    ,'CONTINUATIONSNEXT': []
                    ,'CONTINUATIONSFULL': []
                    ,'FAVOURITE': None          # Not Used
                    ,'ISERROR': None            # Not Used
                    ,'COMMON': None             # Not Used
                }

                #
                #   REGEX
                #
                # Extract matches using compiled regex pattern
                move_tuples = re.findall(MOVE_REGEX, self[key]['PGN'])

                ##
                ##  ID NUMBER
                ##
                opening_id += 1

                ##
                ##  MOVESSTRING
                ##
                formatted_game = ', '.join(['{' + ' || '.join(move) + '}' for move in move_tuples])
                self[key]['MOVESSTRING'] = "[" + formatted_game + "]"

                #
                #   BOARDSTRING
                #
                self[key]['BOARDSTRING'] = row['BOARD'].replace(",", " || ")

                ##
                ##  NUMMOVES
                ##
                #Use the parser regx to determine the last move number of each PGN
                last_move_number = int(move_tuples[-1][0])
                self[key]['NUMMOVES'] = last_move_number

                ##
                ##  NEXTTOMOVE
                ##
                #Use the parser regx to determine which player is next to move
                final_move = move_tuples[-1][2]
                if final_move == '':
                    self[key]['NEXTTOMOVE'] = "Black"
                else:
                    self[key]['NEXTTOMOVE'] = "White"

                ##
                ##  FAMILY / VARIATION / SUBVARIATION
                ##
                #Split the CSV "Name" column into colons and semicolons
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

                #
                #   CHECKMATE
                #
                self[key]['CHECKMATE'] = '#' in self[key]

                ##
                ##  CASTLINGWHITE / CASTLINGBLACK
                ##
                for move in move_tuples:
                    if move[1] == 'O-O':
                        self[key]['CASTLINGWHITE'] = 'Kingside'
                    elif move[1] == 'O-O-O':
                        self[key]['CASTLINGWHITE'] = 'Queenside'
                    elif move[2] == 'O-O':
                        self[key]['CASTLINGBLACK'] = 'Kingside'
                    elif move[2] == 'O-O-O':
                        self[key]['CASTLINGBLACK'] = 'Queenside'


    ##
    ##  CONTINUATIONSNEXT / CONTINUATIONSFULL
    ##
    def add_continuations(self):
        for (key, value) in self.items():
            dict_pgn = value['PGN']
            dict_nummoves = value['NUMMOVES'] + 1
        
            filtered_next_move_ids = [value['ID'] for key, value in self.items() if key.startswith(dict_pgn) and value['NUMMOVES'] == dict_nummoves]
            self[key]['CONTINUATIONSNEXT'] = filtered_next_move_ids

            filtered_full_move_ids = [value['ID'] for key, value in self.items() if key.startswith(dict_pgn)]
            self[key]['CONTINUATIONSFULL'] = filtered_full_move_ids


        

    def print_to_terminal(self):
        for (key, value) in self.items():
            print(value)
            print()



def create_json_file(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)


mydict = OpeningsDict()
mydict.add_continuations()
# mydict.print_to_terminal()


create_json_file(mydict, 'openings_data.json')
