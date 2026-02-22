# The Docker image that will be used to build your app
image: node:22.14.0

before_script:
  # Functions that should be executed before the build script is run
  - npm ci

create-pages:
  stage: build
  script:
    # Specify the steps involved to build your app here
    - npm run build
  pages: true  # publishes the default public directory

  # Trigger rules
  rules:
  - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

