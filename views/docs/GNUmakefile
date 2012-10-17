# Get `mdown` command via 
# sudo npm install git+http://github.com/niallo/gh-markdown-cli.git -g -g
# from: https://github.com/niallo/gh-markdown-cli
DOCS := $(wildcard md/*.md)
DOCS_HTML := $(patsubst md/%, html/%, $(patsubst %.md,%.html,$(DOCS)))
ASSETS := $(wildcard assets/*.html)

all: $(DOCS_HTML)

html/%.html : md/%.md $(ASSETS)
	mdown -o html/ --header "assets/header.html" --footer "assets/footer.html" $<

