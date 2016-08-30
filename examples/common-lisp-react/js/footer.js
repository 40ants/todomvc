/* (DEFVAR APP (OR APP (CREATE))) */
var app = app || {  };
/* ((LAMBDA ()
      (DEFCOMPONENT *TODO-FOOTER NIL
       (LET ((ACTIVE-TODO-WORD (APP.UTILS.PLURALIZE (@ THIS PROPS COUNT) item))
             (CLEAR-BUTTON
              (WHEN (> (@ THIS PROPS COMPLETED-COUNT) 0)
                (JSL
                 (BUTTON CLASS-NAME clear-completed ON-CLICK
                  (@ THIS PROPS ON-CLEAR-COMPLETED) Clear completed))))
             (NOW-SHOWING (@ THIS PROPS NOW-SHOWING)))
         (JSL
          (FOOTER CLASS-NAME footer
           (SPAN CLASS-NAME todo-count (STRONG (@ THIS PROPS COUNT))
            ACTIVE-TODO-WORD)
           (UL CLASS-NAME filters
            (LI
             (A HREF #/ CLASS-NAME
              (CLASS-NAMES
               (CREATE SELECTED (= NOW-SHOWING (AREF APP ALL_TODOS))))
              All))
            (LI
             (A HREF #/active CLASS-NAME
              (CLASS-NAMES
               (CREATE SELECTED (= NOW-SHOWING (AREF APP ACTIVE_TODOS))))
              Active))
            (LI
             (A HREF #/completed CLASS-NAME
              (CLASS-NAMES (CREATE SELECTED (= NOW-SHOWING COMPLETED_TODOS)))
              Completed)))
           CLEAR-BUTTON))))
      (SETF (AREF APP TodoFooter) *TODO-FOOTER))) */
(function () {
    var TodoFooter = React.createClass({ 'displayName' : '*TODO-FOOTER', 'render' : function () {
        var activeTodoWord = app.utils.pluralize(this.props.count, 'item');
        var clearButton = this.props.completedCount > 0 ? React.DOM.button({ onClick : this.props.onClearCompleted, className : 'clear-completed' }, 'Clear completed') : null;
        var nowShowing1 = this.props.nowShowing;
        return React.DOM.footer({ className : 'footer' }, React.DOM.span({ className : 'todo-count' }, React.DOM.strong({  }, this.props.count), ' ', activeTodoWord), React.DOM.ul({ className : 'filters' }, React.DOM.li({  }, React.DOM.a({ className : classNames({ selected : nowShowing1 === app['ALL_TODOS'] }), href : '#/' }, 'All')), React.DOM.li({  }, React.DOM.a({ className : classNames({ selected : nowShowing1 === app['ACTIVE_TODOS'] }), href : '#/active' }, 'Active')), React.DOM.li({  }, React.DOM.a({ className : classNames({ selected : nowShowing1 === 'COMPLETED_TODOS' }), href : '#/completed' }, 'Completed'))), clearButton);
    } });
    return app['TodoFooter'] = TodoFooter;
})();
