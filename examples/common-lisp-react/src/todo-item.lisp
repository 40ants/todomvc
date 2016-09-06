(quickload "panic")

(defvar app (or app (create)))


((lambda ()
   (defvar +escape-key+ 27)
   (defvar +enter-key+ 13)

   (panic:defclass *todo-item (todo
                               editing
                               on-destroy
                               on-save
                               on-edit
                               on-toggle)
     
     (defun handle-submit (event)
       (let ((val (chain this state edit-text (trim))))
         (if val
             (progn
               (on-save val)
               (set-state (create edit-text val)))
             (on-destroy))))
     
     (defun handle-edit ()
       (on-edit)
       (set-state (create edit-text (@ todo title))))

     (defun handle-key-down (event)
       (when (= event.which +escape-key+)
         (set-state (create edit-text
                            (@ todo title)))
         (on-cancel event))
       (when (= event.which +enter-key+)
         (chain this (handle-submit event))))

     (defun handle-change (event)
       (when editing
         (set-state (create edit-text event.target.value))))

     (defun get-initial-state ()
       (create edit-text (@ todo title)))
     
     (defun should-component-update (next-props next-state)
       (or (not (eq (@ next-props todo)
                    (@ this props todo)))
           (not (eq (@ next-props editing)
                    (@ this props editing)))
           (not (eq (@ next-state edit-text)
                    (@ this state edit-text)))))
     
     (defun component-did-update (prev-props)
       (when (and (not (@ prev-props editing))
                  editing)
         (let* ((node (chain *react (find-d-o-m-node
                                     (@ this refs edit-field))))
                (value-length (@ node value length)))
           
           (chain node (focus))
           (chain node (set-selection-range value-length
                                            value-length)))))
     (defun render ()
       (panic:jsl
        (:li :class-name (class-names
                          (create completed (@ todo completed)
                                  editing editing))
             (:div :class-name "view"
                   (:input :class-name "toggle"
                           :type "checkbox"
                           :checked (@ todo completed)
                           :on-change on-toggle)
                   (:label :on-double-click handle-edit
                           (@ todo title))
                   (:button :class-name "destroy"
                            :on-click on-destroy))
             
             (:input :ref "editField"
                     :class-name "edit"
                     :value (@ this state edit-text)
                     :on-blur handle-submit
                     :on-change handle-change
                     :on-key-down handle-key-down)))))
   
   (setf (aref app "TodoItem")
         *todo-item)))
