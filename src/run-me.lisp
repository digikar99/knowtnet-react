(ql:quickload '(:clsql
                :alexandria
                :iterate
                :trivia
                :cl-markup
                :reader
                :parenscript
                :alexandria
                :cl-json) :silent t)
(use-package :iterate)
(import '(ps:chain ps:@))


(defun $ (object) (write-to-string object))
(defun concat (&rest strings) (apply #'concatenate 'string strings))
(setq *compile-verbose* nil
      *compile-print* nil)

(load "config.lisp")
(push (car (uiop:directory* "."))
      clsql-sys:*foreign-library-search-paths*)

(clsql:connect *ktdb-connection-spec* :database-type :mysql :if-exists :old)
(load *orm-definition-file*)
(defvar links (clsql:select 'link :flatp t))
(defvar themes (clsql:select 'theme :flatp t))
(load *base-file*)

(format t "Preparations Done. Running run-me.lisp~%")
(format t "Total links: ~D~%" (length links))

(reader:enable-reader-syntax 'hash-table 'get-val)
(defvar *theme-link-id-list-hash-table* {})
;; generate link-files
(iter (for link in links)
      (let* ((theme (car (link-themes link)))
             (link-file (concat *data-directory* ($ (link-id link)))))
        (push (link-id link) [*theme-link-id-list-hash-table* theme])
        (with-open-file (f link-file
                           :if-exists :supersede
                           :if-does-not-exist :create
                           :direction :output)
          (trivia:let-match1
              (link id url title description newbie-p) link
            (cl-json:encode-json {:equal "id" id
                                         "url" url
                                         "title" title
                                         "description" description
                                         "newbie-p" newbie-p
                                         "theme" theme}
                                 f)))))


(iter (for (theme link-id-list) in-hashtable *theme-link-id-list-hash-table*)
      (format t "  ~D links in ~D~%" (length link-id-list) theme))

(let ((server-data "serverData.json"))
  (format t "Writing ~D...~%" server-data)
  (with-open-file (f server-data :if-exists :supersede
                     :if-does-not-exist :create
                     :direction :output)
    (cl-json:encode-json {:equal "front-page" "index.html"
                                 "about-page" "about.html"
                                 "theme-list" (mapcar #'theme-name themes)
                                 "theme-link-id-list-map" *theme-link-id-list-hash-table*
                                 "num-links" (length links)
                                 "about" *about-text*}
                         f))
  (format t "Done!~%"))




