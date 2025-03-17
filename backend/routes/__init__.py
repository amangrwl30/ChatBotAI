from .generate_response import generate_response_endpoint

def setup_routes(app):
    app.add_url_rule('/generate_response', view_func=generate_response_endpoint, methods=['POST'])