FROM ruby:3.3.8-alpine3.21

# Install dependencies
RUN apk add --no-cache \
    build-base \
    git \
    nodejs \
    npm

WORKDIR /usr/src/docs

# Copy Gemfile and install gems
COPY docs/Gemfile docs/Gemfile.lock ./
RUN bundle install

# Copy Metasploit module metadata so Jekyll plugin can read it (../db/modules_metadata_base.json)
RUN mkdir -p /usr/src/db
COPY db/modules_metadata_base.json /usr/src/db/

# Copy documentation files
COPY docs ./

# Expose Jekyll default port
EXPOSE 4000

# Start Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000"]
