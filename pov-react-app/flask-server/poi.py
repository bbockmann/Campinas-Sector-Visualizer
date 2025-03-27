from flask import Flask

app = Flask(__name__)

@app.route("/poi")
def members():
    return "poi data"

if __name__ == "__main__":
    app.run(debug=True, port=5001)

