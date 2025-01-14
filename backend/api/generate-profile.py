import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get GitHub token from environment variable
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')

def fetch_github_data(username):
    """
    Fetches GitHub user data and analyzes their repositories
    Args:
        username (str): GitHub username to fetch data for
    Returns:
        dict: User profile data including name, bio, and top programming languages
    """
    try:
        # Add GitHub token to headers
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"token {GITHUB_TOKEN}"
        }

        # Check rate limit status
        rate_limit_url = "https://api.github.com/rate_limit"
        rate_limit_response = requests.get(rate_limit_url, headers=headers)
        rate_limit_data = rate_limit_response.json()
        remaining = rate_limit_data['resources']['core']['remaining']
        print(f"Remaining API calls: {remaining}")

        # Construct GitHub API endpoints
        url = f"https://api.github.com/users/{username}"
        repos_url = f"https://api.github.com/users/{username}/repos"

        # Fetch basic user information
        user_response = requests.get(url, headers=headers)
        user_response.raise_for_status()
        user_data = user_response.json()

        # Fetch user's repositories
        repos_response = requests.get(repos_url, headers=headers)
        repos_response.raise_for_status()
        repos_data = repos_response.json()

        # Limit number of repos to process (to avoid rate limits)
        repos_to_process = repos_data[:10]  # Process only first 10 repos

        # Analyze programming languages across repositories
        languages = {}
        for repo in repos_to_process:
            lang_url = repo['languages_url']
            lang_response = requests.get(lang_url, headers=headers)
            lang_response.raise_for_status()
            lang_data = lang_response.json()
            
            for lang, count in lang_data.items():
                languages[lang] = languages.get(lang, 0) + count

        # Construct and return user profile
        return {
            "name": user_data.get("name"),
            "bio": user_data.get("bio"),
            "github_url": user_data.get("html_url"),
            "top_languages": sorted(languages, key=languages.get, reverse=True)[:5]
        }
    except requests.exceptions.RequestException as e:
        print(f"GitHub API error: {str(e)}")
        return {"error": f"GitHub API error: {str(e)}"}
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {"error": f"Unexpected error: {str(e)}"}

# Define API endpoint for profile generation
@app.route('/backend/api/generate-profile', methods=['POST'])
def generate_profile():
    """
    Flask route handler for profile generation requests
    Expects POST request with JSON body containing 'github_username'
    Returns generated profile data or error message
    """
    try:
        print("Generating profile")
        # Parse incoming JSON data
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
        
        # Extract GitHub username from request
        github_username = data.get("github_username")
        print(f"Received username: {github_username}")

        # Validate username presence
        if not github_username:
            return jsonify({"error": "GitHub username required"}), 400

        # Fetch and process GitHub data
        profile_data = fetch_github_data(github_username)
        if "error" in profile_data:
            return jsonify(profile_data), 500

        # Return successful response
        return jsonify(profile_data)
    except Exception as e:
        # Handle any errors in the request processing
        print(f"Error in generate_profile: {str(e)}")
        print(traceback.format_exc())  # Print detailed error trace
        return jsonify({"error": str(e)}), 500

# Run the Flask application if this file is run directly
if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Start server in debug mode on port 5000
