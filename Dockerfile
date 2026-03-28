# Use the lightweight and secure Alpine Nginx image
FROM nginx:alpine

# Cloud Run defaults to directing traffic to port 8080.
# We must expose this port to ensure Cloud Run maps the traffic correctly.
EXPOSE 8080

# Modify the default Nginx configuration to listen on port 8080 instead of 80.
# The user's mock-prototype.html will serve as the index.html.
RUN sed -i -e 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

# Copy the custom HTML file into Nginx's strictly exposed html directory.
# Rename it to index.html so Nginx serves it automatically on the root path (/).
COPY mock-prototype.html /usr/share/nginx/html/index.html
