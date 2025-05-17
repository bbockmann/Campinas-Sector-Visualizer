# Campinas Data Visualizer

### Author
[Ben Bockmann](https://github.com/bbockmann)


### Date
Last updated May 2025

## About
During the spring semester of 2025, I was tasked with creating a data visualization tool for a team of researchers from Maine and Brazil. The app consists of a front-end created with React and a back-end running on Python Flask. The data is in two parts: a GeoJSON file containing geographic sectors and associated data, and Point of Interest (POI) data. The primary tool I used is the Google Maps Javascript API, which I chose for its high level of customizability and good documentation. There are three primary functions of the app: 
* **Sector Image Viewer**: when a user clicks a sector, a Google Maps satellite image is retrieved and displayed. If there are multiple images for a given sector, only the first one is displayed.
* **POI Distribution**: also upon selecting a sector, all the POIs for that sector are displayed. The top five POIs by quantity are colored distinctly. In a pop-out section, the POI types are listed in order or quantity, and when the user hovers over a given type, all POIs of that type are highlighted on the map. 
* **City-wide Data Trends**: A choropleth map allows users to visualize various sector-level metrics, selectable via dropdown. 

Additional features include a search bar to locate sectors by their `CD_SETO` ID.

## Data Specification
### Satellite Images
Satellite images should be named with the following format:
```php_template
satellite_image_<SectorId>_<ImgNum>.png
```
* `SectorId` is the unique ID of the associated sector
* `ImgNum` is the index of the image. If a sector only has one image, ImgNum should still be 1.

### Sector GeoJSON
The GeoJSON should have the following format: 
```json
{"type":"FeatureCollection", "features": [
  {
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates":[...]
    },
    "properties":
    {
      "CD_SETO": "350950205000001P",
      "v0001":316,
      "n_ndvd_":346,
      "mn_nd_f":0.279077686100203,},
      ...
  },
]}
```
Where `features` is a list of sectors, each having a `properties` list consisting the relevant sector data. The current code is set up to treat `CD_SETO` as the unique sector ID, but this can be modified.

### Points of Interest
The POI data is in a CSV format, with the following column names: 
```
name
type
user_ratings
rating
latitude
longitude
census_sector_code
```
The `type` value should be a list returned by the Google API, with the first element being the most descriptive. The first element in the `type` list is what is used to classify each POI. The `census_sector_code` is the unique ID of each sector. 

## Development and Deployment
### Front-end
In order to enable future customization of the data visualization tool, I will list out the hardcoded values that are unique to Campinas. The front-end component of the app begins at the `Map.jsx` component. In this file, the default and selected sector styles, as well as the choropleth color gradient, are hardcoded at the top of the file. Additionally, the unique sector ID (`CD_SETO` for Campinas) is hardcoded in the program. Generally, `CD_SETO` is hardcoded across the entire project, something which would be good to fix in the future. The coordinates of Campinas are passed to the Google Maps component, so that on initial render the map is centered correctly. In `SectorData.jsx`, the generic link for each image is hardcoded. To ensure that API calls work both on the development side and the deployment, environment variables are used. On the development side, the variable `REACT_APP_API_BASE_URL` points to the localhost port where the backend runs.

### Back-end
The backend is hosted locally by Flask and cloud hosted by Render (free tier). It handles parsing the GeoJSON and POI CSV data. Each route in the backend is documented and its functionality, including the return value format, is specified. 

### Deployment
I deployed the app across three cloud services: Vercel (front-end), Render (back-end), and Google Cloud Storage (data and image hosting). Vercel and Render are both connected to this repo, so pushing to main immediately triggers a redeployment on both ends.  
