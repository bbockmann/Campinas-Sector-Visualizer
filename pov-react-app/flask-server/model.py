from flask import Flask
import pandas as pd
import os
import io
import requests
from flask_cors import CORS



app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
CORS(app)  # Apply CORS to all routes


CSV_FILE_PATH = "/Users/bennybock1/Desktop/pov-react-app/public/data/pois_by_census_sector 2022.csv"
GOOGLE_CSV_LINK = "https://storage.googleapis.com/campinas-data/pois_by_census_sector%202022.csv"


# For LOCAL file
# try:
#     poi_df = pd.read_csv(CSV_FILE_PATH)
#     # poi_df = poi_df.set_index("name")
#     print(f"CSV loaded successfully! {poi_df.shape[0]} rows found.")
# except FileNotFoundError:
#     print("Error: CSV file not found. Check the file path.")
#     poi_df = None

# test_row = poi_df[poi_df['census_sector_code'] == "350950205000001P"].iloc[0]
# test_row = poi_df.loc["350950205000001P"]

# print("************")
# print(test_row)

# For GCS file
poi_csv_response = requests.get(GOOGLE_CSV_LINK)
poi_csv = poi_csv_response.text
poi_df = pd.read_csv(io.StringIO(poi_csv))

# print(poi_df.head())

@app.route("/proxy-json")
def proxy_json():
    print("proxying data request")
    url = "https://storage.googleapis.com/campinas-data/final_cadunico_setores.json"
    response = requests.get(url)
    return (response.text, response.status_code, {"Access-Control-Allow-Origin": "*"})

@app.route("/poi/<sector_id>")
def poi(sector_id):
    # row = poi_df[poi_df['census_sector_code'] == sectorid].to_json()
    # return row
    print("getting pois for " + sector_id)
    test_row = poi_df[poi_df['census_sector_code'] == sector_id].to_json()
    # test_row = poi_df.loc["350950205000001P"]
    # test_row = "test"
    return test_row




@app.route("/")
def root():
    return "this is the root of the server"

@app.route("/test")
def members():
    return {"message": "this is the test api working!"}

if __name__ == "__main__":
    print(app.url_map)  # Debugging: Check if routes are correctly loaded
    app.run(debug=True, port=5001)

