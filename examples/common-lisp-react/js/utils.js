/* (DEFVAR APP (OR APP (CREATE))) */
var app = app || {  };
/* ((LAMBDA ()
      (DEFUN RANDOM-BYTE () (ROUND (RANDOM 16)))
      (DEFUN UUID ()
        (LET ((UUID ))
          (DOTIMES (I 32)
            (LET ((RANDOM (RANDOM-BYTE)))
              (WHEN (OR (= I 8) (= I 12) (= I 16) (= I 20))
                (SETF UUID (+ UUID -)))
              (SETF UUID
                      (+ UUID
                         (CHAIN
                          (CASE I
                            (12 4)
                            (16 (LOGIOR (LOGAND RANDOM 3) 8))
                            (OTHERWISE RANDOM))
                          (TO-STRING 16))))))
          UUID))
      (DEFUN PLURALIZE (COUNT WORD)
        (IF (= COUNT 1)
            WORD
            (+ WORD s)))
      (DEFUN STORE (NAMESPACE DATA)
        (IF DATA
            (LET ((DATA-STRING (CHAIN *J-S-O-N (STRINGIFY DATA))))
              (CHAIN LOCAL-STORAGE (SET-ITEM NAMESPACE DATA-STRING)))
            (LET ((STORE (CHAIN LOCAL-STORAGE (GET-ITEM NAMESPACE))))
              (OR (AND STORE (CHAIN *J-S-O-N (PARSE STORE))) 'NIL))))
      (DEFUN EXTEND ()
        (LET ((NEW-OBJ (CREATE)))
          (DOLIST (OBJ ARGUMENTS)
            (FOR-IN (KEY OBJ) (SETF (AREF NEW-OBJ KEY) (AREF OBJ KEY))))
          NEW-OBJ))
      (SETF (AREF APP Utils)
              (CREATE UUID UUID PLURALIZE PLURALIZE STORE STORE EXTEND EXTEND))
      (SETF (AREF APP utils) (AREF APP Utils)))) */
(function () {
    function randomByte() {
        return Math.round(Math.floor(16 * Math.random()));
    };
    function uuid() {
        var uuid1 = '';
        for (var i = 0; i < 32; i += 1) {
            with ({ i : i, random : null }) {
                var random = randomByte();
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid1 += '-';
                };
                uuid1 += (function () {
                    switch (i) {
                    case 12:
                        return 4;
                    case 16:
                        return random & 3 | 8;
                    default:
                        return random;
                    };
                })().toString(16);
            };
        };
        return uuid1;
    };
    function pluralize(count, word) {
        return count === 1 ? word : word + 's';
    };
    function store(namespace, data) {
        if (data) {
            var dataString = JSON.stringify(data);
            return localStorage.setItem(namespace, dataString);
        } else {
            var store2 = localStorage.getItem(namespace);
            return store2 && JSON.parse(store2) || [];
        };
    };
    function extend() {
        var newObj = {  };
        for (var obj = null, _js_idx3 = 0; _js_idx3 < arguments.length; _js_idx3 += 1) {
            obj = arguments[_js_idx3];
            for (var key in obj) {
                newObj[key] = obj[key];
            };
        };
        return newObj;
    };
    app['Utils'] = { uuid : uuid,
                  pluralize : pluralize,
                  store : store,
                  extend : extend
                };
    return app['utils'] = app['Utils'];
})();
