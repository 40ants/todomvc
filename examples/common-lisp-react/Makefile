all: js/utils.js js/footer.js js/todo-item.js js/todo-model.js js/app.js

js/utils.js: src/utils.lisp
	sigil src/utils.lisp > js/utils.js

js/footer.js: src/footer.lisp
	sigil src/footer.lisp > js/footer.js

js/todo-item.js: src/todo-item.lisp
	sigil src/todo-item.lisp > js/todo-item.js

js/todo-model.js: src/todo-model.lisp
	sigil src/todo-model.lisp > js/todo-model.js

js/app.js: src/app.lisp
	sigil src/app.lisp > js/app.js
