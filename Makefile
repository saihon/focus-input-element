NAME := focus-input-element
TARGET = all
SRCZIP := source-code.zip

.PHONY: build clean build-all build-chrome build-firefox source-code

build: build-$(TARGET)

build-all: build-firefox build-chrome

build-firefox:
	@cd ./dist && \
	zip -r ../$(NAME).xpi icons js options.html manifest.json

build-chrome:
	zip -r $(NAME).zip dist

# for source code submission
source-code:
	zip -r $(SRCZIP) ./src ./package.json ./tsconfig.json ./webpack.config.js

clean:
	rm -rf ./dist ./node_modules $(SRCZIP) $(NAME).zip $(NAME).xpi
