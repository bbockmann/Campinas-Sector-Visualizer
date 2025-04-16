from flask import Flask
from flask import jsonify
import pandas as pd
import requests
import io
from flask_cors import CORS
from os import environ


app = Flask(__name__)
CORS(app)  # Apply CORS to all routes

GOOGLE_CSV_LINK = "https://storage.googleapis.com/campinas-data/pois_by_census_sector%202022.csv"

# For GCS file
poi_csv_response = requests.get(GOOGLE_CSV_LINK)
poi_csv = poi_csv_response.text
poi_df = pd.read_csv(io.StringIO(poi_csv))

# 350950205000001P
test_rows = poi_df[poi_df['census_sector_code'] == "350950205000001P"]
pois = {}
for index, row in test_rows.iterrows():
    types = row['type'].strip("[]").replace("'", "").replace(" ", "").split(",")
    primary_type = types[0]
    lat = row["latitude"]
    long = row["longitude"]
    pois[index] = {"type": primary_type, "lat": lat, "long": long}
print(pois)

@app.route("/")
def root():
    return "this is the root of the server"

@app.route("/proxy-json")
def proxy_json():
    print("proxying data request")
    url = "https://storage.googleapis.com/campinas-data/final_cadunico_setores.json"
    response = requests.get(url)
    return (response.text, response.status_code, {"Access-Control-Allow-Origin": "*"})

@app.route("/poi/<sector_id>")
def poi(sector_id):
    rows = poi_df[poi_df['census_sector_code'] == sector_id]
    pois = {}
    for index, row in rows.iterrows():
        types = row['type'].strip("[]").replace("'", "").replace(" ", "").split(",")
        primary_type = types[0]
        lat = row["latitude"]
        long = row["longitude"]
        pois[index] = {"type": primary_type, "lat": lat, "long": long}
    return jsonify(pois)
    # return poi_df[poi_df['census_sector_code'] == sector_id].to_json()

@app.route("/poisummary/<sector_id>")
def poiSummary(sector_id):
    poi_data = poi_df[poi_df['census_sector_code'] == sector_id]
    type_count = {}
    for index, row in poi_data.iterrows():
        types = row['type'].strip("[]").replace("'", "").replace(" ", "").split(",")
        primary_type = types[0]

        if primary_type in type_count.keys():
            type_count[primary_type] += 1
        else:
            type_count[primary_type] = 1
    print(type_count)

    return jsonify(type_count)


@app.route("/health")
def health():
    return {"status": "ok"}, 200 

if __name__ == "__main__":
    # print(app.url_map)  # Debugging: Check if routes are correctly loaded
    # app.run(debug=True, port=5001)
    app.run(debug=True, host="0.0.0.0", port=int(environ.get("PORT", 10000)))


