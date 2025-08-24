from flask import Flask, request, jsonify, render_template
import util

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('app.html')

# API to get location names
@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        'locations': util.get_location_names()
    })
    # Allow cross-origin requests
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# API to predict home price
@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    # Fetch JSON data from request body instead of form data
    data = request.get_json()

    # Extract values from JSON
    total_sqft = float(data['total_sqft'])
    location = data['location']
    bhk = int(data['bhk'])
    bath = int(data['bath'])

    # Calculate estimated price
    estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)

    # Send response as JSON
    response = jsonify({
        'estimated_price': estimated_price
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    util.load_saved_artifacts()
    app.run(debug=True)
