/* (DEFVAR APP (OR APP (CREATE))) */
var app = app || {  };
/* ((LAMBDA ()
      (DEFCLASS *TODO-FOOTER
                (COUNT COMPLETED-COUNT NOW-SHOWING ON-CLEAR-COMPLETED)
                (DEFUN RENDER ()
                  (LET ((ACTIVE-TODO-WORD (APP.UTILS.PLURALIZE COUNT item))
                        (CLEAR-BUTTON
                         (WHEN (> COMPLETED-COUNT 0)
                           (JSL
                            (BUTTON CLASS-NAME clear-completed ON-CLICK
                             ON-CLEAR-COMPLETED Clear completed)))))
                    (JSL
                     (FOOTER CLASS-NAME footer
                      (SPAN CLASS-NAME todo-count (STRONG COUNT)
                       ACTIVE-TODO-WORD)
                      (UL CLASS-NAME filters
                       (LI
                        (A HREF #/ CLASS-NAME
                         (CLASS-NAMES
                          (CREATE SELECTED
                           (= NOW-SHOWING (AREF APP ALL_TODOS))))
                         All))
                       (LI
                        (A HREF #/active CLASS-NAME
                         (CLASS-NAMES
                          (CREATE SELECTED
                           (= NOW-SHOWING (AREF APP ACTIVE_TODOS))))
                         Active))
                       (LI
                        (A HREF #/completed CLASS-NAME
                         (CLASS-NAMES
                          (CREATE SELECTED (= NOW-SHOWING COMPLETED_TODOS)))
                         Completed)))
                      CLEAR-BUTTON)))))
      (SETF (AREF APP TodoFooter) *TODO-FOOTER))) */
(function () {
    var TodoFooter = React.createClass({ render : function () {
        var g582 = this;
        var activeTodoWord = app.utils.pluralize(g582.props.count, 'item');
        var clearButton = g582.props.completedCount > 0 ? React.DOM.button({ onClick : g582.props.onClearCompleted, className : 'clear-completed' }, 'Clear completed') : null;
        return React.DOM.footer({ className : 'footer' }, React.DOM.span({ className : 'todo-count' }, React.DOM.strong({  }, g582.props.count), ' ', activeTodoWord), React.DOM.ul({ className : 'filters' }, React.DOM.li({  }, React.DOM.a({ className : classNames({ selected : g582.props.nowShowing === app['ALL_TODOS'] }), href : '#/' }, 'All')), React.DOM.li({  }, React.DOM.a({ className : classNames({ selected : g582.props.nowShowing === app['ACTIVE_TODOS'] }), href : '#/active' }, 'Active')), React.DOM.li({  }, React.DOM.a({ className : classNames({ selected : g582.props.nowShowing === 'COMPLETED_TODOS' }), href : '#/completed' }, 'Completed'))), clearButton);
    } });
    return app['TodoFooter'] = TodoFooter;
})();
