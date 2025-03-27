from flask import Flask
import pandas as pd
import os

app = Flask(__name__)


CSV_FILE_PATH = "/Users/bennybock1/Desktop/pov-react-app/public/data/pois_by_census_sector 2022.csv"

try:
    poi_df = pd.read_csv(CSV_FILE_PATH)
    # poi_df = poi_df.set_index("name")
    print(f"CSV loaded successfully! {poi_df.shape[0]} rows found.")
except FileNotFoundError:
    print("Error: CSV file not found. Check the file path.")
    poi_df = None

# test_row = poi_df[poi_df['census_sector_code'] == "350950205000001P"].iloc[0]
# test_row = poi_df.loc["350950205000001P"]

# print("************")
# print(test_row)


@app.route("/poi/<sector_id>")
def poi(sector_id):
    # row = poi_df[poi_df['census_sector_code'] == sectorid].to_json()
    # return row
    print("getting pois for " + sector_id)
    test_row = poi_df[poi_df['census_sector_code'] == sector_id].to_json()
    # test_row = poi_df.loc["350950205000001P"]
    # test_row = "test"
    return test_row





@app.route("/test")
def members():
    return {"message": "this is the test api working!"}

if __name__ == "__main__":
    app.run(debug=True, port=5001)

