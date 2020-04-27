angular.module("udacity.grading", ["angular-storage", "ui.bootstrap", "ui.codemirror", "ui.router", "udacity.templates", "udacity.common", "udacity.auth", "udacity.submissions", "udacity.projects", "hc.marked", "ui.select", "pascalprecht.translate"]).config(["$httpProvider", "$locationProvider", "$sceProvider", "markedProvider", function(e, t, i, n) {
        t.hashPrefix("!"), e.interceptors.push("AuthInterceptor"), e.interceptors.push("TermsNotAcceptedInterceptor"), n.setOptions({
            gfm: !0
        }), i.enabled(!1)
    }]).config(["$translateProvider", function(e) {
        e.registerAvailableLanguageKeys(["en-us", "pt-br", "zh-cn"], {
            "en*": "en-us",
            "pt*": "pt-br",
            "zh*": "zh-cn",
            "*": "en-us"
        }).useStaticFilesLoader({
            prefix: "/translations/",
            suffix: ".json"
        }).preferredLanguage("en-us").fallbackLanguage("en-us").useSanitizeValueStrategy("sce")
    }]).controller("MainCtrl", ["$rootScope", "$window", "$location", "$translate", "store", "UsersModel", "PageContextProvider", "LanguageService", function(e, t, i, n, r, o, a, s) {
        var u = this;
        u.pageContext = a, u.logout = function() {
            AuthenticationService.clear(), t.location.replace("http://www.udacity.com")
        }, e._ = _, o.fetch().then(function(t) {
            var i = t.data;
            e.isGrader = !(!i || !_.includes(["grader", "staff"], i.role)), e.isStaff = !(!i || !_.includes(["staff"], i.role))
        }), s.setUserLanguage()
    }]).run(["IdentificationService", function(e) {
        return e.ensureIdentified()
    }]).run(["$rootScope", "$location", "AuthenticationService", function(e, t, i) {
        e.$on("$stateChangeSuccess", function(e, i, n, r, o) {
            var a = t.search();
            t.search(a)
        })
    }]).run(["$rootScope", function(e) {
        e.$on("$locationChangeSuccess", function(t, i, n) {
            var r = i.split("#!/")[1];
            if (r) {
                for (var o = r.split("?")[0], a = o.split("/"), s = -1, u = "", c = a.length - 1; c >= 0; c--) {
                    var l = a[c];
                    /^\d+$/.test(l) ? s = parseInt(l) : "" === u && (u = l)
                }
                var d, m, f = {
                    "quality-specifications": ["info", "review quality specification"],
                    dashboard: ["dashboard", "dashboard"],
                    "projects-selector": ["dashboard", "project selector"],
                    reviews: ["review", "review"],
                    shared: ["review", "shared"],
                    submissions: ["submission", "submission"],
                    projects: ["project", "submit project common"],
                    rubrics: ["rubric", "submit project common"],
                    start: ["rubric", "submit project common"],
                    "submit-zip": ["rubric", "submit zip"],
                    "submit-file": ["rubric", "submit file"],
                    "submit-link": ["rubric", "submit link"],
                    "in-review": ["rubric", "in review"],
                    auth: ["auth", "auth"]
                };
                u in f ? (d = f[u][0], m = f[u][1]) : (d = "undefined, fix it", m = "undefined, fix it");
                var p = {
                    url: i,
                    path: i.split("?")[0],
                    referrer: i === n ? document.referrer : n
                };
                s !== -1 && (p.elID = s), e.segmentPageProperties = p, analytics.page(d, m, p)
            }
        })
    }]), angular.module("udacity.auth", ["udacity.common", "ngCookies", "angular-storage", "ui.router"]),
    function() {
        var e = "https://user-api.udacity.com",
            t = "https://review.udacity.com",
            i = "https://reviews.udacity.com",
            n = "https://review-api.udacity.com",
            r = "https://auth.udacity.com/sign-in",
            o = "https://graduation-api.udacity.com/api",
            a = 72,
            s = 82,
            u = "a0324fc4fca953b2ee06047a12f1483a",
            c = "https://www.udacity.com/course/viewer#!/",
            l = "https://mentor-dashboard.udacity.com/terms-of-service",
            d = "https://mentor-dashboard.udacity.com/handbook/reviews",
            m = moment.utc("2017-08-01' 00:00"),
            f = "2017-08-01",
            p = "https://mentor-dashboard.udacity.com",
            h = "https://classroom.udacity.com",
            g = "https://community-api.udacity.com";
        angular.module("udacity.common", ["angular-storage", "ui.router", "ngFileUpload", "hc.marked", "ui.codemirror", "pascalprecht.translate"]).constant("ENDPOINT_URI", n + "/api/v1").constant("HOTH_AUTH_URI", r).constant("SESSION_URI", n + "/sessions").constant("GITHUB_URI", n + "/auth/github").constant("CODE_AUDIT_RUBRIC_ID", a).constant("NOCODE_AUDIT_RUBRIC_ID", s).constant("SMYTE_CLIENT_KEY", u).constant("GRADUATION_API_URI", o).constant("REVIEWS_URL", t).constant("REVIEWS_V2_URL", i).constant("AGREEMENT_URL", l).constant("HANDBOOK_URL", d).constant("AGREEMENT_DEADLINE", m).constant("LATEST_AGREEMENT_VERSION", f).constant("COURSE_BASE_URL", c).constant("UDACITY_USERS_API_URL", e).constant("MENTOR_DASHBOARD_URL", p).constant("CLASSROOM_URL", h).constant("COMMUNITY_API_URL", g)
    }(), angular.module("udacity.projects", ["ui.bootstrap", "ui.codemirror", "udacity.common", "udacity.auth", "ngAnimate", "ngSanitize", "angular-storage", "pascalprecht.translate"]), angular.module("udacity.submissions", ["ui.bootstrap", "ui.codemirror", "ui.router", "ngSanitize", "angularMoment", "udacity.common", "pascalprecht.translate"]), angular.module("udacity.grading").config(["$urlRouterProvider", function(e) {
        e.otherwise("/404")
    }]).run(["$rootScope", "$location", "AuthenticationService", "LoadingService", "AlertBoxService", function(e, t, i, n, r) {
        e.$on("$stateChangeStart", function(e, t) {
            n.setLoading(!1), r.propagateNextMessage()
        })
    }]), angular.module("udacity.common").config(["$stateProvider", function(e) {
        e.state("loading", {
            url: "/loading",
            templateUrl: "common/templates/loading.tmpl.html"
        }).state("error", {
            url: "/error",
            templateUrl: "common/templates/error.tmpl.html"
        }).state("forbidden", {
            url: "/forbidden",
            templateUrl: "common/templates/forbidden.tmpl.html"
        }).state("404", {
            url: "/404",
            templateUrl: "common/templates/404.tmpl.html"
        })
    }]), angular.module("udacity.projects").config(["$stateProvider", "$urlRouterProvider", function(e, t) {
        t.when("/projects/{idOrKey}*path", ["$match", "$location", "ProjectsModel", function(e, t, i) {
            return i.translateOrFetch(e.idOrKey).then(function(i) {
                var n = i.data,
                    r = _.chain(n.rubrics).sortBy("created_at").head().value(),
                    o = "/rubric" === e.path ? "/view" : e.path,
                    a = "/rubrics/" + r.id + o;
                t.path(a)
            }, function() {
                t.url("/error")
            })
        }]), e.state("rubrics", {
            "abstract": !0,
            url: "/rubrics/:rubricId",
            template: '<div ui-view autoscroll="true"/>'
        }).state("rubrics.show", {
            url: "",
            authenticate: !0,
            templateUrl: "common/templates/loading.tmpl.html",
            controller: "ShowCtrl"
        }).state("rubrics.view", {
            url: "/view",
            authenticate: !0,
            templateUrl: "projects/templates/rubric.tmpl.html",
            controller: "RubricCtrl"
        }).state("rubrics.instructions", {
            url: "/instructions",
            authenticate: !0,
            templateUrl: "projects/templates/instructions.tmpl.html"
        }).state("rubrics.start", {
            url: "/start",
            authenticate: !0,
            templateUrl: "projects/templates/start.tmpl.html"
        }).state("rubrics.submit-repo", {
            url: "/submit-repo",
            authenticate: !0,
            templateUrl: "projects/templates/submit-repo.tmpl.html"
        }).state("rubrics.submit-zip", {
            url: "/submit-zip",
            authenticate: !0,
            templateUrl: "projects/templates/submit-zip.tmpl.html"
        }).state("rubrics.submit-file", {
            url: "/submit-file",
            authenticate: !0,
            templateUrl: "projects/templates/submit-zip.tmpl.html"
        }).state("rubrics.submit-text", {
            url: "/submit-text?template&filename&filetype",
            authenticate: !0,
            templateUrl: "projects/templates/submit-text.tmpl.html"
        }).state("rubrics.submit-link", {
            url: "/submit-link",
            authenticate: !0,
            templateUrl: "projects/templates/submit-link.tmpl.html"
        }).state("rubrics.in-review", {
            url: "/in-review",
            authenticate: !0,
            templateUrl: "projects/templates/in-review.tmpl.html"
        }).state("public-reviews-show", {
            url: "/reviews/:submissionId/shared",
            authenticate: !1,
            templateUrl: "projects/templates/share-review.tmpl.html",
            controller: "ShareReviewCtrl"
        }).state("reviews-show", {
            url: "/reviews/:submissionId?audit",
            authenticate: !0,
            templateUrl: "projects/templates/show-review.tmpl.html",
            controller: "ShowReviewCtrl"
        })
    }]), angular.module("udacity.submissions").config(["$stateProvider", function(e) {
        e.state("submissions.agreement", {
            url: "/agreement",
            controller: ["AGREEMENT_URL", function(e) {
                window.location.href = e
            }]
        }).state("submissions", {
            "abstract": !0,
            url: "/submissions",
            template: '<div ui-view autoscroll="true"/>'
        }).state("submissions.apply", {
            url: "/apply",
            controller: "ApplyCtrl"
        }).state("submissions.start", {
            url: "/start",
            authenticate: !0,
            templateUrl: "common/templates/loading.tmpl.html",
            controller: "SubmissionStartCtrl"
        }).state("submissions.projects-selector", {
            url: "/projects-selector",
            authenticate: !0,
            controller: "ProjectsSelectorCtrl"
        }).state("submissions.ready", {
            url: "/ready",
            templateUrl: "submissions/templates/ready.tmpl.html"
        }).state("submissions.dashboard", {
            url: "/dashboard?tab&submitted&certified",
            authenticate: !0,
            controller: "DashboardCtrl"
        }).state("submissions.show", {
            url: "/{submissionId:[0-9]+}",
            authenticate: !0,
            templateUrl: "submissions/templates/submission-details.tmpl.html",
            controller: "SubmissionDetailsCtrl"
        }).state("submissions.quality-specifications", {
            url: "/quality-specifications?id",
            authenticate: !0,
            templateUrl: "submissions/templates/quality-specifications.tmpl.html"
        }).state("submissions.reviewer-faq", {
            url: "/reviewer-faq",
            authenticate: !0,
            templateUrl: "submissions/templates/reviewer-faq.tmpl.html",
            controller: "FooterCtrl"
        }).state("submissions.student-faq", {
            url: "/student-faq",
            authenticate: !0,
            templateUrl: "submissions/templates/student-faq.tmpl.html",
            controller: "FooterCtrl"
        })
    }]), angular.module("udacity.auth").service("AuthenticationService", ["$window", "$cookies", "$location", "$q", "SmyteService", "HOTH_AUTH_URI", function(e, t, i, n, r, o) {
        var a = this;
        a.getJwtCookie = function() {
            return t.get("_jwt") || t.get("_jwt_token")
        }, a.getClaimsFromJWT = function(e) {
            var t = {};
            return "undefined" != typeof e && (t = JSON.parse(atob(e.split(".")[1]))), t
        }, a.clear = function() {
            t.remove("_jwt"), t.remove("_jwt_token")
        }, a.authenticate = function() {
            var t = o + "?next=" + encodeURIComponent(i.absUrl());
            e.open(t, "_self")
        }
    }]), angular.module("udacity.auth").service("IdentificationService", ["$q", "$browser", "$cookies", "UsersModel", function(e, t, i, n) {
        var r = this;
        r.ensureIdentified = function() {
            return n.fetch().then(function(e) {
                var t = e.data,
                    n = i.get("ajs_user_id");
                n !== '"' + t.udacity_key + '"' && analytics.identify(t.udacity_key, {
                    email: t.email,
                    name: t.name,
                    role: t.role,
                    reviews_app_user_id: t.id,
                    accepted_terms: t.accepted_terms
                })
            })
        }
    }]), angular.module("udacity.submissions").controller("ApiTokenCtrl", ["$scope", "$uibModal", "UsersModel", function(e, t, i) {
        var n = this;
        n.showApiTokenModal = function() {
            return i.fetchApiToken().then(function(i) {
                var n = e.$new();
                n.apiToken = i.data.token, t.open({
                    templateUrl: "common/templates/api-token-modal.tmpl.html",
                    scope: n,
                    size: "md"
                })
            })
        }
    }]), angular.module("udacity.common").directive("alertBox", function() {
        var e = 15e3,
            t = {
                success: "alert-success",
                notification: "alert-info",
                error: "alert-danger"
            };
        return {
            scope: {},
            replace: !0,
            controller: ["$timeout", "$scope", "$sce", "AlertBoxService", function(i, n, r, o) {
                function a() {
                    s && (i.cancel(s), s = null)
                }
                o.setAlertBoxDirectiveScope(n), n.dismissed = !0, n.message = null;
                var s;
                n.setMessage = function(o, u) {
                    if (void 0 === u && (u = {}), void 0 === u.messageType && (u.messageType = "notification"), void 0 === u.timeout && (u.timeout = e), !t[u.messageType]) throw new Error("Invalid message type requested: " + u.messageType);
                    a(), n.dismissed = !1, n.message = r.trustAsHtml(o), n.alertClass = t[u.messageType], u.timeout && (s = i(function() {
                        n.dismiss()
                    }, u.timeout))
                }, n.dismiss = function() {
                    n.dismissed = !0, a()
                }
            }],
            restrict: "A",
            templateUrl: "common/directives/alert-box.tmpl.html"
        }
    }), angular.module("udacity.common").directive("busyClick", ["$q", function(e) {
        function t(e) {
            e.find(".glyphicon").hide(), e.prepend(angular.element('<i class="busy-click-spinner glyphicon glyphicon-refresh animate-spin"></i>'))
        }

        function i(e) {
            e.find(".busy-click-spinner").remove(), e.find(".glyphicon").show()
        }
        return {
            link: function(n, r) {
                r.on("click", function() {
                    r.prop("disabled", !0), t(r);
                    var o = n.$apply(n.busyClick);
                    o && e.when(o)["finally"](function() {
                        r.prop("disabled", !1), i(r)
                    })
                })
            },
            scope: {
                busyClick: "&"
            }
        }
    }]), angular.module("udacity.common").directive("codeComment", ["CommentsModel", "DirtyPreventNavigationService", function(e, t) {
        var i = ["$scope", "$element", "$timeout", "$animate", function(i, n, r, o) {
            function a(e) {
                i.body = e.body, i.category = e.category, i.commentId = e.id
            }

            function s() {
                i.editing = !1, i.commentForm.$setPristine(), u(), l()
            }

            function u() {
                i.$emit("commentLayoutChanged", i.line)
            }

            function c() {
                i.$emit("newCommentCancelled", i.line)
            }

            function l() {
                r(function() {
                    var e = n.find("img");
                    e.on("load", function() {
                        u()
                    })
                })
            }
            l(), t.monitorScope(i, "commentForm"), o.enabled(n.find(".comment-editor"), !1), o.enabled(n.find(".comment-viewer"), !1), i.isNewComment = function() {
                return !i.commentId
            }, i.editing = i.isNewComment(), i.categories = [{
                label: "Required",
                value: "critical"
            }, {
                label: "Suggestion",
                value: "nitpick"
            }, {
                label: "Awesome",
                value: "awesome"
            }], i.renameCategories = function(e) {
                return {
                    critical: "Required",
                    nitpick: "Suggestion",
                    awesome: "Awesome"
                }[e]
            }, i.modifiedComment = {
                body: i.body || "",
                category: i.category
            }, i.$on("cancelNewComment", function() {
                i.isNewComment() && !i.modifiedComment.body && i.cancelComment()
            }), i.submitComment = function() {
                var t = {
                    body: i.modifiedComment.body,
                    category: i.modifiedComment.category,
                    position: i.line
                };
                return i.isNewComment() ? e.create(i.contentId, t).then(function(e) {
                    var t = e.data;
                    a(t), i.$emit("commentAdded", t), s()
                }) : e.update(i.commentId, t).then(function(e) {
                    a(e.data), s()
                })
            }, i.cancelComment = function() {
                s(), i.modifiedComment.body = i.body, i.isNewComment() && c()
            }, i.deleteComment = function() {
                confirm("Are you sure?") && e["delete"](i.commentId).then(function() {
                    i.$emit("commentDeleted", i.line)
                })
            }, i.startEdit = function() {
                i.editing = !0, u()
            }
        }];
        return {
            controller: i,
            templateUrl: "common/directives/code-comment.tmpl.html",
            scope: {
                contentId: "@",
                line: "@",
                body: "@",
                category: "@",
                commentId: "@",
                editable: "="
            }
        }
    }]), angular.module("udacity.common").service("CodeReviewService", function() {
        var e = this;
        e.filterSupportedFiles = function(e) {
            return _.filter(e, function(e) {
                var t = e.path.lastIndexOf(".");
                if (t === -1) return !0;
                var i = e.path.slice(t);
                return !_.includes([".pdf", ".docx"], i)
            })
        }
    }).directive("codeReview", function() {
        var e = ["$scope", "$timeout", "$element", "CodeReviewService", function(e, t, i, n) {
            function r(e) {
                return !u || u.test(e)
            }

            function o(e) {
                var t = (e || "").trim();
                u = t.length > 0 ? a(t) : null
            }

            function a(e) {
                return e = e.replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&"), e = e.replace(/[\*]/g, ".*"), new RegExp(e, "i")
            }

            function s() {
                var e = 66,
                    t = i.find("[mirror]");
                t.length > 0 && $("html, body").animate({
                    scrollTop: t.offset().top - e
                }, 70)
            }
            e.$watch("filterPattern", _.debounce(function() {
                e.$apply(function() {
                    o(e.filterPattern)
                })
            }, 50)), e.files = _.sortBy(n.filterSupportedFiles(e.files), function(e) {
                return -e.comments_count
            }), e.setCurrentFileIndex = function(i) {
                e.currentFileIndex === i ? e.currentFileIndex = null : e.currentFileIndex = i, t(function() {
                    s()
                })
            }, e.isFileVisible = function(e) {
                return r(e.path)
            };
            var u = null
        }];
        return {
            controller: e,
            templateUrl: "common/directives/code-review.tmpl.html",
            restrict: "A",
            scope: {
                files: "=",
                rubric: "=",
                allowComments: "="
            }
        }
    }), angular.module("udacity.common").directive("critiqueEditor", function() {
        return {
            templateUrl: "common/directives/critique-editor.tmpl.html",
            scope: {
                critique: "=",
                success: "&",
                error: "&",
                cancel: "&",
                failedRequiredPlaceholder: "=",
                passedRequiredPlaceholder: "=",
                optionalPlaceholder: "="
            },
            controller: "CritiqueEditorController",
            restrict: "A"
        }
    }).controller("CritiqueEditorController", ["$scope", "$q", "CritiquesModel", "DirtyPreventNavigationService", function(e, t, i, n) {
        function r(t) {
            return e.modifiedCritique.result === t
        }

        function o() {
            var t = _.pick(e.modifiedCritique, ["id", "result", "observation"]);
            return i.update(e.critique.id, t).then(function(t) {
                _.extend(e.critique, t.data), (e.success || _.noop)()
            }, function() {
                (e.error || _.noop)()
            })
        }

        function a() {
            e.modifiedCritique = _.omit(e.critique, "rubric_item"), e.modifiedCritique.resultLocked = "passed" === e.critique.prev_result || "exceeded" === e.critique.prev_result, e.modifiedCritique.resultLocked && (e.modifiedCritique.result = e.critique.prev_result)
        }
        var s = e.failedRequiredPlaceholder || "Explain why the project doesn't meet the specification and provide guidance for next submission.",
            u = e.passedRequiredPlaceholder || "Explain what the student needs to do to exceed the specification.",
            c = e.optionalPlaceholder || "Give the student some constructive feedback.";
        e.rubricItem = e.critique.rubric_item, a(), n.monitorScope(e, "form"), e.toggleCollapse = function() {
            $(".one-line-collapse").collapse("toggle")
        }, e.isObservationRequired = function() {
            return r("failed") || r("passed") && e.isExceedable()
        }, e.isExceedable = function() {
            return !(!e.rubricItem || !e.rubricItem.exceedable)
        };
        var l = !0;
        e.toggleExceededRequirements = function(e) {
            l = _.isUndefined(e) ? !l : e
        }, e.isExceededRequirementsVisible = function() {
            return l
        }, e.getPlaceholderText = function() {
            return r("failed") ? "Required: " + s : r("passed") && e.isObservationRequired() ? "Required: " + u : "Optional: " + c
        }, e._submit = function() {
            return o()
        }, e._reset = function() {
            return confirm("Are you sure?") ? (e.modifiedCritique.observation = null, e.modifiedCritique.resultLocked || (e.modifiedCritique.result = null), o()) : t.when()
        }, e._cancel = function() {
            a(), (e.cancel || _.noop)()
        }
    }]), angular.module("udacity.common").directive("critiqueView", function() {
        return {
            templateUrl: "common/directives/critique-view.tmpl.html",
            scope: {
                critique: "=",
                editable: "=",
                editClicked: "&",
                isCareer: "="
            },
            controller: "CritiqueViewController",
            restrict: "A"
        }
    }).controller("CritiqueViewController", ["$scope", function(e) {
        e.rubricItem = e.critique.rubric_item, e.critiqueLocked = function() {
            return e.critique.autograded
        }
    }]), angular.module("udacity.common").directive("critiquesEditor", function() {
        return {
            templateUrl: "common/directives/critiques-editor.tmpl.html",
            scope: {
                critiquesAccessor: "=",
                editable: "=",
                state: "=",
                failedRequiredPlaceholder: "=",
                passedRequiredPlaceholder: "=",
                optionalPlaceholder: "=",
                submission: "=",
                isCareer: "="
            },
            controller: "CritiquesEditorController",
            restrict: "A"
        }
    }).controller("CritiquesEditorController", ["$scope", "$http", "SubmissionsModel", "DirtyPreventNavigationService", function(e, t, i, n) {
        e.sectionCritiquesState = {}, n.monitorScope(e, "general-comment-form"), _.each(e.critiquesAccessor.getSections(), function(t) {
            e.sectionCritiquesState[t.id] = {}
        }), e.state && e.$watch("sectionCritiquesState", function() {
            var t = _.map(e.sectionCritiquesState, "editing");
            e.state.editing = _.some(t), e.state.partlyComplete = t && !_.every(t)
        }, !0), e.submission && !e.submission.general_comment && (e.general_comment_editing = !0), e.saveGeneralComment = function() {
            return e.general_comment_editing = !1, i.submitGeneralComment(e.submission.id, e.submission.general_comment)
        }, e.resetGeneralComment = function() {
            return confirm("Are you sure?") && (e.submission.general_comment = null, e.saveGeneralComment(), e.general_comment_editing = !0), !0
        }, e.startEditing = function() {
            e.general_comment_editing = !0
        }
    }]), angular.module("udacity.common").directive("loadingContainer", ["LoadingService", function(e) {
        return {
            controller: ["$scope", function(t) {
                t.loading = !1, t.setLoading = function(e) {
                    t.loading = e
                }, e.setScope(t)
            }],
            restrict: "A",
            transclude: !0,
            templateUrl: "common/directives/loading-container.tmpl.html"
        }
    }]), angular.module("udacity.common").directive("markdownTextarea", ["$q", "$timeout", "AttachmentUploader", "MarkdownTextHelper", function(e, t, i, n) {
        var r = 5,
            o = 1e7;
        return {
            scope: {
                form: "="
            },
            restrict: "A",
            transclude: !0,
            templateUrl: "common/directives/markdown-textarea.tmpl.html",
            link: function(a, s) {
                function u() {
                    var e = m.get(0);
                    e.scrollTop = e.scrollHeight
                }

                function c(r) {
                    if (a.errorMessage = null, r && 0 !== r.length) {
                        var o = l(r);
                        if (o) return void(a.errorMessage = o);
                        d(!0);
                        var s = [],
                            c = m.val();
                        _.each(a.files, function(e) {
                            c = n.insertFileUploading(c, e), s.push(i.upload(e).then(function(t) {
                                var i = m.val();
                                i = n.replaceFileUploadingWithFileLink(i, e, t), m.val(i), u()
                            }, function(t) {
                                var i = m.val();
                                i = n.updateFileUploadingStatus(i, e, "Error: " + t), m.val(i), u()
                            }, function(t) {
                                var i = m.val();
                                i = t < 100 ? n.updateFileUploadingStatus(i, e, "Uploading " + t + "%") : n.updateFileUploadingStatus(i, e, "Processing..."), m.val(i)
                            }))
                        }), m.val(c), t(function() {
                            u()
                        }), e.all(s)["finally"](function() {
                            d(!1), m.change()
                        })
                    }
                }

                function l(e) {
                    if (e.length > r) return "You can only attach " + r + " images at a time.";
                    for (var t = 0; t < e.length; t++)
                        if (e[t].size && e[t].size > o) return "Attachment unsuccessful. Image too large."
                }

                function d(e) {
                    a.form && a.form.$setValidity("uploading." + m.attr("name"), !e)
                }
                a.accept = "image/*,.pdf";
                var m = s.find("textarea");
                a.$watch("files", function() {
                    c(a.files)
                })
            }
        }
    }]), angular.module("udacity.common").directive("mirror", ["$compile", "$q", "$timeout", "mirror.WidgetsAccessor", "ContentsModel", "CommentsModel", function(e, t, i, n, r, o) {
        var a = {
            js: "javascript",
            jsx: "javascript",
            ts: {
                name: "javascript",
                typescript: !0
            },
            css: "css",
            html: "text/html",
            htm: "text/html",
            py: "python",
            txt: "text",
            md: "markdown",
            rmd: "markdown",
            markdown: "markdown",
            swift: "text/swift",
            sql: "sql",
            java: "clike",
            xml: "xml",
            gradle: "text",
            rst: "rst",
            yml: "text/x-yaml",
            yaml: "text/x-yaml"
        };
        return {
            scope: {
                file: "=",
                allowComments: "="
            },
            templateUrl: "common/directives/mirror.tmpl.html",
            controller: ["$scope", "$timeout", function(i, s) {
                function u(e, t, i) {
                    var n = m.getWidget(i);
                    if (n) return n;
                    var r = c(t, i);
                    return n = e.addLineWidget(i, r.get(0), {
                        coverGutter: !0,
                        noHScroll: !0
                    }), m.setWidget(i, n), d(n), n
                }

                function c(t, n) {
                    var r = angular.element("<div></div>");
                    r.attr("id", "comment-wrapper-" + n);
                    var o = angular.element("<div></div>");
                    return o.attr({
                        "code-comment": "",
                        line: n,
                        "content-id": i.file.id,
                        editable: i.allowComments
                    }), t && o.attr({
                        body: t.body,
                        category: t.category,
                        "comment-id": t.id
                    }), r.html(o), e(o)(i), r
                }

                function l(e, t) {
                    i.$broadcast("cancelNewComment"), u(e, null, t)
                }

                function d(e) {
                    e && s(function() {
                        e.changed()
                    })
                }
                var m = new n;
                i.$on("commentAdded", function() {
                    i.file.comments_count++
                }), i.$on("commentDeleted", function(e, t) {
                    return i.file.comments_count--, m.removeWidget(t), !1
                }), i.$on("commentLayoutChanged", function(e, t) {
                    return d(m.getWidget(t)), !1
                }), i.$on("newCommentCancelled", function(e, t) {
                    return m.removeWidget(t), !1
                }), i.generateEditorOptions = function(e) {
                    var t = e.path.substr(e.path.lastIndexOf(".") + 1).toLowerCase();
                    return {
                        mode: a[t] || "text",
                        theme: "mbo",
                        readOnly: !0,
                        lineNumbers: !0,
                        viewportMargin: 1 / 0
                    }
                }, i.codeMirrorLoaded = function(e) {
                    i.isLoading = !0;
                    var n = r.fetchBlobData(i.file.blob),
                        a = o.all(i.file.id).then(function(e) {
                            return e.data
                        });
                    t.all([n, a]).then(function(t) {
                        var n = t[0],
                            r = t[1];
                        e.setValue(n), angular.forEach(r, function(t) {
                            var i = parseInt(t.position);
                            u(e, t, i)
                        }), e.on("cursorActivity", function() {
                            i.allowComments && l(e, e.doc.getCursor().line)
                        }), s(function() {
                            e.refresh()
                        })
                    })["finally"](function() {
                        i.isLoading = !1
                    })
                }
            }]
        }
    }]).factory("mirror.WidgetsAccessor", function() {
        var e = function() {
            this.widgetsByLine = {}
        };
        return e.prototype = {
            getWidget: function(e) {
                return this.widgetsByLine[parseInt(e)]
            },
            setWidget: function(e, t) {
                this.widgetsByLine[parseInt(e)] = t
            },
            removeWidget: function(e) {
                var t = this.getWidget(e);
                t && (t.clear(), this.widgetsByLine[parseInt(e)] = null)
            }
        }, e
    }), angular.module("udacity.common").directive("reviewsList", function() {
        var e = function(e, t, i, n, r) {
            e.votes = {}, e.user_id, r.fetch().then(function(i) {
                e.user_id = i.data.id, e.reviews.forEach(function(t) {
                    e.votes[t.id] = {
                        grader_id: t.grader_id
                    }
                });
                var r = _.filter(e.reviews, function(e) {
                        return "completed" === e.status && i.data.id !== e.grader_id && i.data.id !== e.user_id
                    }),
                    o = r.map(function(t) {
                        return n.getVote(t.id, {
                            passthrough403: !0
                        }).then(function(i) {
                            _.assign(e.votes[t.id], {
                                feedback: i.data.feedback,
                                value: i.data.value
                            })
                        })
                    });
                t.all(o).then(_.defer(function() {
                    e.$apply()
                }))
            }), e.performedReview = function(t) {
                var i = e.votes[t];
                return !_.isUndefined(i) && (!!_.isNumber(i.grader_id) && e.user_id === i.grader_id)
            }, e.filteredReviews = _.filter(e.reviews, function(e) {
                return "erred" !== e.status
            });
            var o = _.filter(e.filteredReviews, function(e) {
                return "canceled" !== e.status
            });
            e.nonCanceledReviewIndexHash = {}, _.each(o, function(t, i, n) {
                e.nonCanceledReviewIndexHash[t.id] = n.length - i
            }), e.showVoteModal = function(t, n) {
                e.voteInProgress = {
                    submissionId: t,
                    newValue: n
                }, i.open({
                    templateUrl: "submissions/templates/vote-feedback-modal.tmpl.html",
                    controller: "VoteFeedbackModalCtrl",
                    controllerAs: "ctrl",
                    scope: e,
                    size: "md"
                })
            }, e.errorMessage = "", e.erred = function(t) {
                e.errorMessage = t
            }
        };
        return e.$inject = ["$scope", "$q", "$uibModal", "SubmissionsModel", "UsersModel"], {
            controller: e,
            templateUrl: "common/directives/reviews-list.tmpl.html",
            scope: {
                reviews: "=",
                thisReview: "=",
                isCareer: "="
            },
            restrict: "A"
        }
    }), angular.module("udacity.common").directive("rubricItemsList", function() {
        return {
            templateUrl: "common/directives/rubric-items-list.tmpl.html",
            controller: "RubricItemsListCtrl",
            scope: {
                rubricId: "="
            },
            restrict: "A"
        }
    }).controller("RubricItemsListCtrl", ["$scope", "RubricItemsAccessor", "RubricItemsModel", function(e, t, i) {
        var n = {};
        e.rubricItemsAccessor = null, i.all(e.rubricId).then(function(i) {
            e.rubricItemsAccessor = new t(i.data), _.each(e.rubricItemsAccessor.getSections(), function(e) {
                n[e.id] = !0
            })
        }), e.toggleExpansion = function(e) {
            n[e] = !n[e]
        }, e.isExpanded = function(e) {
            return n[e]
        }
    }]), angular.module("udacity.common").directive("scrollIf", ["$timeout", function(e) {
        return {
            scope: {
                scrollIf: "="
            },
            link: function(t, i) {
                function n() {
                    var e = $("body").scrollTop(),
                        t = e + $(window).height();
                    return i.offset().top >= e && i.offset().top + i.height() <= t
                }
                var r = 50;
                t.$watch("scrollIf", function() {
                    e(function() {
                        t.scrollIf && !n() && $("html, body").animate({
                            scrollTop: i.offset().top - r
                        }, 70)
                    })
                })
            }
        }
    }]), angular.module("udacity.common").directive("sectionCritiques", function() {
        return {
            templateUrl: "common/directives/section-critiques.tmpl.html",
            scope: {
                section: "=",
                critiques: "=",
                editable: "=",
                state: "=",
                failedRequiredPlaceholder: "=",
                passedRequiredPlaceholder: "=",
                optionalPlaceholder: "=",
                isCareer: "="
            },
            controller: "SectionCritiquesController",
            restrict: "A"
        }
    }).controller("SectionCritiquesController", ["$scope", function(e) {
        function t() {
            e.state && (e.state.editing = _.some(_.values(n)))
        }
        var i = !0;
        e.toggleExpansion = function() {
            i = !i
        }, e.isExpanded = function() {
            return i
        };
        var n = {},
            r = null;
        e.setEditingCritique = function(i, o, a) {
            a = _.extend({
                initial: !1
            }, a || {});
            var s = !(!o || !e.editable);
            n[i] = s, a.initial || (r = s ? i : null), t()
        }, e.isEditingCritique = function(e) {
            return n[e]
        }, e.isCurrentEditingCritique = function(e) {
            return r === e
        }, _.each(e.critiques, function(t) {
            e.setEditingCritique(t.id, !t.result, {
                initial: !0
            })
        })
    }]), angular.module("udacity.common").directive("singleLineCollapse", function() {
        return {
            templateUrl: "common/directives/single-line-collapse.tmpl.html",
            scope: {
                singleLineCollapse: "=",
                previewLength: "="
            },
            controller: "SingleLineCollapseController",
            restrict: "A"
        }
    }).controller("SingleLineCollapseController", ["$scope", "$element", "$timeout", function(e, t, i) {
        function n() {
            e.collapse = !0, i(function() {
                e.text = e.singleLineCollapse.substr(0, e.previewLength) + "&hellip;", e.collapsed = !0
            }, o)
        }

        function r() {
            e.text = e.singleLineCollapse, i(function() {
                e.collapse = !1, e.collapsed = !1
            })
        }
        e.collapsed = !0, e.collapse = !0;
        var o = 350;
        e.singleLineCollapse.length < e.previewLength ? (e.text = e.singleLineCollapse, e.isToggleShown = !1) : (e.text = e.singleLineCollapse.substr(0, e.previewLength) + "&hellip;", e.isToggleShown = !0), e.toggleCollapse = function() {
            e.collapsed ? r() : n()
        }
    }]), angular.module("udacity.common").directive("stickyFooter", ["$rootScope", function(e) {
        function t(e) {
            var t = $(window).scrollTop(),
                i = $(window).height();
            return t + i > e
        }
        return {
            restrict: "A",
            link: function(i, n) {
                function r() {
                    var e = a.offset().top;
                    return o ? t(e) && (o = !1, n.removeClass("sticky-footer")) : t(n.offset().top + s) || (o = !0, n.addClass("sticky-footer")), !1
                }
                $(window).load(r), $(window).resize(_.throttle(r, 30)), e.$watch(_.debounce(function() {
                    r()
                }, 30, !1)), $(document).scroll(_.throttle(r, 30));
                var o = n.hasClass("sticky-footer"),
                    a = $("#footer"),
                    s = n.height()
            }
        }
    }]), angular.module("udacity.common").filter("pluralize", function() {
        return function(e, t, i) {
            i || (i = t + "s");
            var n = parseInt(e),
                r = 1 === n ? t : i;
            return [n, r].join(" ")
        }
    }), angular.module("udacity.common").filter("resultLabel", function() {
        var e = {
                exceeded: "Exceeds Specification",
                passed: "Meets Specification",
                failed: "Requires Changes",
                partial_passed: "Feedback provided",
                ungradeable: "Requires Changes"
            },
            t = {
                exceeded: "Exceeds Specifications",
                passed: "Meets Specifications",
                failed: "Requires Changes",
                partial_passed: "Feedback provided",
                ungradeable: "Requires Changes"
            };
        return function(i, n) {
            var r;
            return r = _.has(n, "pluralize") ? t[i] : e[i], r || ""
        }
    }), angular.module("udacity.common").factory("CritiquesAccessor", ["RubricItemsAccessor", function(e) {
        var t = function(t) {
            this.critiquesData = t, this.rubricItemsAccessor = new e(_.map(t, "rubric_item")), this.getCritique = _.memoize(function(e) {
                return _.find(this.critiquesData, {
                    rubric_item_id: e
                })
            }), this.getCritiques = _.memoize(function(e) {
                return _.isUndefined(e) ? this.critiquesData : _.map(this.getRubricItems(e), _.bind(function(e) {
                    return this.getCritique(e.id)
                }, this))
            })
        };
        return t.prototype = {
            getRubricItems: function(e) {
                return this.rubricItemsAccessor.getRubricItems(e)
            },
            getSections: function() {
                return this.rubricItemsAccessor.getSections()
            }
        }, t
    }]), angular.module("udacity.common").factory("DirtyPreventNavigationService", ["$rootScope", "$timeout", function(e, t) {
        var i = !0,
            n = function(n, r) {
                var o = "There are unsaved changes. Leave this page?",
                    a = _.uniqueId("beforeunload.DirtyPreventNavigation-");
                $(window).bind(a, function(e) {
                    if (n[r] && !n[r].$pristine) return e.returnValue = o, o
                });
                var s = e.$on("$stateChangeStart", function(e) {
                    n[r] && !n[r].$pristine && i && (i = !1, t(function() {
                        i = !0
                    }), confirm(o) || e.preventDefault())
                });
                n.$on("$destroy", function() {
                    $(window).unbind(a), s()
                })
            };
        return {
            monitorScope: n
        }
    }]), angular.module("udacity.common").factory("RubricItemsAccessor", function() {
        var e = function(e) {
            this.rubricItemsData = _.sortBy(e, "position"), this.sectionsData = _.chain(this.rubricItemsData).map("section").uniqBy("id").sortBy("position").value(), this.getRubricItems = _.memoize(function(e) {
                return _.filter(this.rubricItemsData, {
                    section_id: e
                })
            })
        };
        return e.prototype = {
            getSections: function() {
                return this.sectionsData
            }
        }, e
    }), angular.module("udacity.common").service("AuditsModel", ["$q", "$http", "Upload", "ApiUrlHelper", function(e, t, i, n) {
        var r = this;
        r.all = function() {
            return t.get(n.createUrl("me", "audits"))
        }, r.markAsRead = function(e) {
            return t.put(n.createUrl("audits", e, "read"))
        }, r.fetchBySubmissionId = function(e, i) {
            return t.get(n.createUrl("submissions", e, "audit"), i || {})
        }, r.assign = function(e, i) {
            var r = i ? {
                purpose: i
            } : {};
            return t.post(n.createUrl("projects", e, "audits", "assign"), r)
        }, r.submit = function(e) {
            return t.put(n.createUrl("audits", e, "submit"))
        }
    }]), angular.module("udacity.common").service("CertAttemptsModel", ["$q", "$http", "ApiUrlHelper", function(e, t, i) {
        var n = this;
        n.fetchMyAttempts = function(e) {
            return t.get(i.createUrl("me", "projects", e, "cert_attempts"))
        }, n.startNextAttempt = function(e) {
            return t.post(i.createUrl("me", "projects", e, "cert_attempts", "start"))
        }
    }]), angular.module("udacity.common").service("CertificationsModel", ["$q", "$http", "ApiUrlHelper", function(e, t, i) {
        var n = this;
        n.fetchMyCertifications = function() {
            return t.get(i.createUrl("me", "certifications"))
        }, n.fetch = function(e) {
            return t.get(i.createUrl("certifications", e)).then(function(e) {
                return _.each(e.data.trainings, function(e) {
                    e.training_submissions = _.sortBy(e.training_submissions, function(e) {
                        return new Date(e.created_at).getTime()
                    })
                }), e
            })
        }
    }]), angular.module("udacity.common").service("CommentsModel", ["$http", "ApiUrlHelper", function(e, t) {
        var i = this;
        i.all = function(i) {
            return e.get(t.createUrl("contents", i, "comments"))
        }, i.create = function(i, n) {
            return e.post(t.createUrl("contents", i, "comments"), n)
        }, i.update = function(i, n) {
            return e.put(t.createUrl("comments", i), n)
        }, i["delete"] = function(i) {
            return e["delete"](t.createUrl("comments", i))
        }
    }]), angular.module("udacity.common").service("CommunityRoomsModel", ["$q", "$http", "ApiUrlHelper", function(e, t, i) {
        var n = this;
        n.fetchCommunityRoom = function(e) {
            return t.get(i.getCommunityApiRoomUrl(e))
        }
    }]), angular.module("udacity.common").service("ContentsModel", ["$q", "$http", "ApiUrlHelper", function(e, t, i) {
        function n(e) {
            return decodeURIComponent(atob(e).split("").map(function(e) {
                return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2)
            }).join(""))
        }

        function r(e) {
            return e > 96 ? e - 71 : e > 64 ? e - 65 : e > 47 ? e + 4 : 43 == e ? 62 : 47 == e ? 63 : 0
        }

        function o(e) {
            for (var t = 3 * ~~(e.length / 4) + (e.length % 4 == 0 ? 0 : e.length % 4 - 1), i = new Uint8Array(t), n = 0, r = 1; r < e.length; r++) switch (r % 4) {
                case 1:
                    i[n++] = (e[r - 1] << 2) + (e[r] >> 4);
                    break;
                case 2:
                    i[n++] = (e[r - 1] << 4) + (e[r] >> 2);
                    break;
                case 3:
                    i[n++] = (e[r - 1] << 6) + e[r]
            }
            return i
        }

        function a(e, t) {
            t = "undefined" != typeof t ? t : "utf-8";
            try {
                var i = new TextEncoder("utf-8").encode(e.replace(/\s/g, "").replace(/=/g, ""));
                return i = i.map(r), i = o(i), new TextDecoder(t).decode(i)
            } catch (a) {
                return n(e.replace(/\s/g, ""))
            }
        }
        var s = this;
        s.all = function(e) {
            return t.get(i.createUrl("submissions", e, "contents"))
        };
        var u = {},
            c = 50;
        s.fetchBlobData = function(e) {
            var i = u[e];
            return i || (_.keys(u).length > c && (u = {}), i = t.get(e).then(function(e) {
                var t = _.get(e, "data", "");
                return a(t.replace(/\s/g, ""))
            }), u[e] = i), i
        }
    }]), angular.module("udacity.common").service("CritiquesModel", ["$http", "ApiUrlHelper", function(e, t) {
        var i = this;
        i.update = function(i, n) {
            return e.put(t.createUrl("critiques", i), n)
        }, i.allForSubmission = function(i) {
            return e.get(t.createUrl("submissions", i, "critiques"))
        }, i.allForAudit = function(i) {
            return e.get(t.createUrl("audits", i, "critiques"))
        }, i.createForSubmission = function(i, n) {
            return e.post(t.createUrl("submissions", i, "critiques"), {
                rubric_item_id: n
            })
        }, i.createForAudit = function(i, n) {
            return e.post(t.createUrl("audits", i, "critiques"), {
                rubric_item_id: n
            })
        }
    }]), angular.module("udacity.common").service("EnrollmentsModel", ["$q", "$http", "ApiUrlHelper", function(e, t, i) {
        var n = this;
        n.fetchEnrollment = function(e) {
            return t.get(i.createUrl("enrollments", e), {
                passthrough403: !0
            })
        }
    }]), angular.module("udacity.common").service("EntitlementsModel", ["$q", "$http", "ApiUrlHelper", function(e, t, i) {
        var n = this;
        n.fetchMyEntitlements = function(e, n) {
            return t.get(i.createUrl("me", "entitlements"), {
                params: {
                    project_id: e,
                    active: n
                }
            })
        }, n.check = function(e) {
            return n.fetchMyEntitlements(e, !0).then(function(e) {
                if (0 === e.data.length) {
                    var t = i.getCareerPortalLink();
                    window.location.href = t
                }
            })
        }
    }]), angular.module("udacity.common").service("OnboardingsModel", ["$q", "$http", "ApiUrlHelper", function(e, t, i) {
        var n = this;
        n.attempt = function(e) {
            return t.post(i.createUrl("trainings", e, "attempt"))
        }
    }]), angular.module("udacity.common").service("ProjectsModel", ["$q", "$http", "ApiUrlHelper", function(e, t, i) {
        var n = this;
        n.all = function() {
            return t.get(i.createUrl("projects"))
        }, n.allWithNanodegree = function() {
            return t.get(i.createUrl("projects") + "?decode_nd_key=true")
        }, n.fetch = function(e) {
            return t.get(i.createUrl("projects", e))
        }, n.fetchWithNanodegree = function(e) {
            return t.get(i.createUrl("projects", e) + "?decode_nd_key=true")
        }, n.translate = function(n) {
            return e(function(e, r) {
                t.get(i.createUrl("projects") + "?udacity_key=" + n).then(function(t) {
                    t.data = _.head(t.data), e(t)
                }, r)
            })
        }, n.translateOrFetch = function(t) {
            return e(function(e, i) {
                n.translate(t).then(function(r) {
                    r.data ? e(r) : n.fetch(t).then(e, i)
                }, i)
            })
        }, n.updateProjectGradable = function(e, n) {
            var r = i.createUrl("projects", e, "certification");
            return n ? t.post(r) : t["delete"](r)
        }
    }]), angular.module("udacity.common").service("ReviewerToolkitModel", ["$q", "$http", "ApiUrlHelper", function(e, t, i) {
        var n = this;
        n.fetch = function(e, n) {
            return t.get(i.createUrl("reviewer_toolkits"), {
                params: {
                    project_id: e,
                    language: n
                }
            }).then(function(e) {
                return 0 === e.data.length ? e.data = null : e.data = e.data[0], e
            })
        }
    }]), angular.module("udacity.common").service("RubricItemsModel", ["$http", "ApiUrlHelper", function(e, t) {
        var i = this;
        i.all = function(i) {
            return e.get(t.createUrl("rubrics", i, "rubric_items"))
        }, i.allOptional = function(e) {
            return i.all(e).then(function(e) {
                var t = e.data;
                return t = _.filter(t, {
                    optional: !0
                }), e.data = t, e
            })
        }
    }]), angular.module("udacity.common").service("RubricsModel", ["$q", "$http", "ApiUrlHelper", function(e, t, i) {
        var n = this;
        n.fetch = function(e, n) {
            return n = n || {}, t.get(i.createUrl("rubrics", e), n)
        }, n.fetchAlternates = function(e) {
            return t.get(i.createUrl("rubrics"), {
                params: {
                    classroom_project_key: e
                }
            })
        }
    }]), angular.module("udacity.common").service("StudentFeedbacksModel", ["$q", "$http", "ApiUrlHelper", function(e, t, i) {
        var n = this;
        n.all = function() {
            return t.get(i.createUrl("me", "student_feedbacks"))
        }, n.fetchMyStats = function() {
            return t.get(i.createUrl("me", "student_feedbacks", "stats"))
        }, n.markAsRead = function(e) {
            return t.put(i.createUrl("student_feedbacks", e, "read"))
        }, n.create = function(e, n) {
            return t.post(i.createUrl("submissions", e, "student_feedback"), n)
        }, n.fetchBySubmissionId = function(e) {
            return t.get(i.createUrl("submissions", e, "student_feedback"))
        }
    }]), angular.module("udacity.common").service("SubmissionsModel", ["$q", "$http", "Upload", "ApiUrlHelper", function(e, t, i, n) {
        function r(t) {
            var i = e.defer();
            return t.progress(function(e) {
                var t = parseInt(100 * e.loaded / e.total);
                i.notify(t)
            }).success(function(e) {
                i.resolve(e)
            }).error(function(e, t) {
                i.reject({
                    data: e,
                    status: t
                })
            }), i.promise
        }
        var o = this;
        o.fetchUserSubmissions = function(e, i) {
            return t.get(n.createUrl("users", e, "submissions") + "?rubric_id=" + i)
        }, o.fetchAssignedSubmissions = function() {
            return t.get(n.createUrl("me", "submissions", "assigned"))
        }, o.fetchMyRubricSubmissions = function(e) {
            return t.get(n.createUrl("me", "submissions"), {
                params: {
                    rubric_id: parseInt(e, 10)
                }
            })
        }, o.fetchMyLatestRubricSubmission = function(t) {
            return e(function(e, i) {
                o.fetchMyRubricSubmissions(t).then(function(t) {
                    t.data = t.data[0], e(t)
                }, function() {
                    i()
                })
            })
        }, o.fetch = function(e) {
            return t.get(n.createUrl("submissions", e))
        }, o.fetchCopyingEvidence = function(e) {
            return t.get(n.createUrl("submissions", e, "copying_evidence"))
        }, o.createWithRepo = function(e, i) {
            return t.post(n.createUrl("rubrics", e, "submissions", "create_for_repo"), i, {
                passthrough403: !0
            })
        }, o.createWithUrl = function(e, i) {
            return i = i || {}, i.notes = i.notes || "", t.post(n.createUrl("rubrics", e, "submissions", "create_for_url"), i, {
                passthrough403: !0
            })
        }, o.createWithZipFile = function(e, t, o) {
            var a = i.upload({
                url: n.createUrl("rubrics", e, "submissions", "create_for_zipfile"),
                fields: t,
                file: o,
                fileFormDataName: "zipfile",
                passthrough403: !0
            });
            return r(a)
        }, o.createWithFiles = function(e, t, o) {
            var a = i.upload({
                url: n.createUrl("rubrics", e, "submissions", "create_for_files"),
                file: o,
                fields: t,
                fileFormDataName: "files[]"
            });
            return r(a)
        }, o.createWithText = function(e, i, r, o) {
            var a = _.extend({}, i, {
                filename: r,
                text: o
            });
            return t.post(n.createUrl("rubrics", e, "submissions", "create_for_text"), a, {
                passthrough403: !0
            })
        }, o.unassignSubmission = function(e) {
            return t.put(n.createUrl("submissions", e, "unassign"))
        }, o.assignSubmission = function(e, i) {
            return t.post(n.createUrl("projects", e, "submissions", "assign"), {
                lang: i
            })
        }, o.ungradeable = function(e, i, r, o) {
            var a = {
                notes: i,
                tag: r,
                plagiarism_source_url: o
            };
            return t.put(n.createUrl("submissions", e, "ungradeable"), a)
        }, o.submitFeedback = function(e, i) {
            return t.put(n.createUrl("submissions", e, "submit"), i)
        }, o.submitGeneralComment = function(e, i) {
            return t.put(n.createUrl("submissions", e, "general_comment"), {
                general_comment: i
            })
        }, o.createAudit = function(e) {
            return t.post(n.createUrl("submissions", e, "create_audit"))
        }, o.reviseReview = function(e) {
            return t.post(n.createUrl("submissions", e, "revise"))
        }, o.uploadAnnotations = function(e, t) {
            var o = i.upload({
                url: n.createUrl("submissions", e, "upload_annotations"),
                file: t,
                fileFormDataName: "files[]"
            });
            return r(o)
        }, o["delete"] = function(e) {
            return t["delete"](n.createUrl("submissions", e))
        }, o.postVote = function(e, i, r) {
            var o = {
                value: i,
                feedback: r || ""
            };
            return t.post(n.createUrl("submissions", e, "vote"), o)
        }, o.getVote = function(e, i) {
            return t.get(n.createUrl("submissions", e, "vote"), i || {})
        }
    }]), angular.module("udacity.common").service("UsersModel", ["$http", "ApiUrlHelper", function(e, t) {
        var i = this,
            n = null;
        i.fetch = function() {
            return n ? n : n = e.get(t.createUrl("me"))
        }, i.fetchReviewer = function(i) {
            return e.get(t.createReviewerUrl(i))
        }, i.update = function(i) {
            return e.put(t.createUrl("me"), i)
        }, i.logout = function() {
            return e["delete"](t.createUrl("sessions"))
        }, i.fetchRepos = function() {
            return e.get(t.createUrl("me", "github", "repos"))
        }, i.fetchGithubAuthorization = function() {
            return e.get(t.createUrl("me", "github", "authorization"))
        }, i.acceptTos = function() {
            return e.put(t.createUrl("me"), {
                accepted_terms: !0
            })
        }, i.becomeGrader = function() {
            return e.put(t.createUrl("me", "become_grader"))
        }, i.fetchApiToken = function() {
            return e.get(t.createUrl("me", "api_token"))
        }
    }]), angular.module("udacity.common").service("AlertBoxService", function() {
        var e, t, i, n = this;
        n.setNowMessage = function(e, t) {
            i.setMessage(e, t)
        }, n.setNextMessage = function(i, n) {
            e = i, t = n
        }, n.propagateNextMessage = function() {
            i.setMessage(e, t), e = void 0, t = void 0
        }, n.setAlertBoxDirectiveScope = function(e) {
            i = e
        }
    }), angular.module("udacity.common").service("ApiUrlHelper", ["ENDPOINT_URI", "GRADUATION_API_URI", "CLASSROOM_URL", "COMMUNITY_API_URL", function(e, t, i, n) {
        function r(e) {
            return $("<a>", {
                href: e
            })[0].hostname
        }
        var o = this;
        o.createUrl = function() {
            var t = Array.prototype.slice.call(arguments);
            return t.unshift(e), t.join("/") + ".json"
        }, o.createGraduationApiUrl = function() {
            var e = Array.prototype.slice.call(arguments);
            return e.unshift(t), e.join("/")
        }, o.createReviewerUrl = function(t) {
            return e + "/user/reviewer_bio?user_id=" + t
        }, o.isUdacityUrl = function(e) {
            return r(e).match(/.*\.udacity\.com/)
        }, o.getCareerPortalLink = function(e) {
            return i + "/career/main#careerServices"
        }, o.getClassroomLink = function(e) {
            return i + "/career/service/" + e + "?destination=classroom"
        }, o.getCommunityApiRoomUrl = function(e) {
            return n + "/api/v1/reviews/room?rubricID=" + e
        }
    }]), angular.module("udacity.common").service("AttachmentUploader", ["$q", "Upload", "ApiUrlHelper", function(e, t, i) {
        var n = this;
        n.upload = function(n) {
            var r = e.defer();
            return t.upload({
                url: i.createUrl("attachments"),
                file: n
            }).progress(function(e) {
                var t = parseInt(100 * e.loaded / e.total);
                r.notify(t)
            }).success(function(e) {
                r.resolve(e.url)
            }).error(function(e) {
                r.reject(e.error)
            }), r.promise
        }
    }]), angular.module("udacity.common").service("AuthInterceptor", ["$window", "$q", "$location", "AuthenticationService", "ApiUrlHelper", function(e, t, i, n, r) {
        var o = this;
        o.request = function(e) {
            var t = n.getJwtCookie();
            return t && r.isUdacityUrl(e.url) && (e.headers.Authorization = "Bearer " + t), e
        }, o.responseError = function(e) {
            return 401 === e.status ? (n.clear(), n.authenticate()) : 403 !== e.status || e.config.passthrough403 || i.path("/forbidden"), t.reject(e)
        }
    }]), angular.module("udacity.common").service("CountryService", function() {
        var e = this;
        e.commonLanguages = [{
            code: "ar",
            name: "Arabic (Modern Standard)"
        }, {
            code: "bn",
            name: "Bengali"
        }, {
            code: "zh_HANS",
            name: "Chinese (Simplified)"
        }, {
            code: "zh_HANT",
            name: "Chinese (Traditional)"
        }, {
            code: "en",
            name: "English"
        }, {
            code: "fr",
            name: "French"
        }, {
            code: "de",
            name: "German"
        }, {
            code: "gu",
            name: "Gujarati"
        }, {
            code: "he",
            name: "Hebrew"
        }, {
            code: "hi",
            name: "Hindi"
        }, {
            code: "it",
            name: "Italian"
        }, {
            code: "id",
            name: "Indonesian"
        }, {
            code: "ja",
            name: "Japanese"
        }, {
            code: "ko",
            name: "Korean"
        }, {
            code: "pt",
            name: "Portuguese"
        }, {
            code: "ru",
            name: "Russian"
        }, {
            code: "es",
            name: "Spanish"
        }, {
            code: "tr",
            name: "Turkish"
        }, {
            code: "ur",
            name: "Urdu"
        }], e.countryNames = ["Afghanistan", "Akrotiri", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Arctic Ocean", "Argentina", "Armenia", "Aruba", "Ashmore and Cartier Islands", "Atlantic Ocean", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Baker Island", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Clipperton Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Republic of the Congo", "Democratic Republic of the Congo", "Cook Islands", "Coral Sea Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Dhekelia", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Islas Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern and Antarctic Lands", "Gabon", "Gambia", "Gaza Strip", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guadeloupe", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City)", "Honduras", "Hong Kong", "Howland Island", "Hungary", "Iceland", "India", "Indian Ocean", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Jan Mayen", "Japan", "Jarvis Island", "Jersey", "Johnston Atoll", "Jordan", "Kazakhstan", "Kenya", "Kingman Reef", "Kiribati", "North Korea", "South Korea", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mexico", "Micronesia, Federated States of", "Midway Islands", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nauru", "Navassa Island", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pacific Ocean", "Pakistan", "Palau", "Palmyra Atoll", "Panama", "Papua New Guinea", "Paracel Islands", "Paraguay", "Peru", "Philippines", "Pitcairn Islands", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Barthelemy", "Saint Helena, Ascension, and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Southern Ocean", "South Georgia and South Sandwich Islands", "South Sudan", "Spain", "Spratly Islands", "Sri Lanka", "Sudan", "Suriname", "Svalbard", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Pacific Island Wildlife Refuges", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands", "Wake Island", "Wallis and Futuna", "West Bank", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"], e.paypalSupportedCountryNames = ["Argentina", "Australia", "Austria", "Belgium", "Brazil", "Bulgaria", "Canada", "Chile", "China", "Costa Rica", "Cyprus", "Czech Republic", "Denmark", "Dominican Republic", "Ecuador", "Estonia", "Finland", "France", "French Guiana", "Germany", "Gibraltar", "Greece", "Guadeloupe", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malaysia", "Malta", "Martinique", "Mexico", "Netherlands", "New Zealand", "Norway", "Philippines", "Poland", "Portugal", "Reunion", "Romania", "San Marino", "Singapore", "Slovakia", "South Korea", "Spain", "Sweden", "Switzerland", "Taiwan", "Thailand", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Venezuela", "Vietnam"]
    }), angular.module("udacity.common").service("ErrorHelper", function() {
        var e = '<a href="https://review.udacity.com/#!/submissions/student-faq">Student FAQ</a>',
            t = '<a href="https://review.udacity.com/#!/submissions/reviewer-faq">Reviewer FAQ</a>',
            i = '<a href="mailto:review-support@udacity.com">review-support@udacity.com</a>',
            n = "visit our " + e + " for more information.",
            r = "An error has occurred. Please try again or email " + i + " for assistance.",
            o = [{
                "base:student_has_open_submission": "You canâ€™t submit again at this time since you have an outstanding submission. Please " + n,
                "base:student_already_passed": "You canâ€™t submit again because youâ€™ve already passed this project. Please " + n
            }, {
                "base:not_submitted_to_project_assistant": "Your code must be submitted to the project assistant before it can be reviewed. Please email " + i + " if you need assistance."
            }, {
                "zipfile:not_a_zip": "Your file can't be unzipped.  It might be damaged or have been created with another tool. Please re-create your zip file or " + n,
                "repo_url:unable_to_process_repo": "We were unable to retrieve information about your repository.  Please try again or email " + i + " for assistance."
            }, {
                "zipfile:too_big": "Your file is too large to submit. Please re-submit a smaller file, or " + n,
                "zipfile:too_many_files": "Your submission contains too many files. Please " + n,
                "zipfile:too_many_reviewable_files": "Your submission contains too many files. Please " + n,
                "zipfile:no_files_submitted": "Your submission contains no files.  Please double-check your upload, or email " + i + " for assistance.",
                "repo_url:too_big": "Your repo is too large to submit. Please re-submit a smaller file, or " + n,
                "repo_url:too_many_files": "Your submission contains too many files. Please " + n,
                "repo_url:too_many_reviewable_files": "Your submission contains too many files. Please " + n,
                "repo_url:no_files_submitted": "Your submission contains no files.  Please double-check your Github repo, or email " + i + " for assistance."
            }, {
                "annotations:bad_extension": "Please choose a file with an appropriate extension.",
                "annotations:too_big": "Your file is too large to submit. Please re-submit a smaller file, or email " + i + " for assistance.",
                "zipfile:bad_extension": "Please choose a file with an appropriate extension."
            }, {
                "base:reviewer_at_limit": "Please complete your current review before starting a new project. Please visit our " + t + " for more information.",
                "language:grader_language_does_not_match": "You are not authorized to review the selected language."
            }],
            a = this;
        a.translateResponse = function(e) {
            return 504 === e.status ? TIMEOUT_ERROR_MESSAGE : 403 === e.status ? _.get(e, "data.error") || "Not Authorized" : 400 == e.status ? a.translateBadRequestResponse(e) : r
        }, a.translateBadRequestResponse = function(e) {
            if (e.data && e.data.error_details) {
                var t = a.getErrorCodesFromErrorDetails(e.data.error_details);
                return a.fetchErrorMessage(t)
            }
            return r
        }, a.fetchErrorMessage = function(e) {
            var t, i;
            "string" == typeof e && (e = [e]);
            for (var n = 0; n < o.length; n++)
                for (var t = o[n], a = 0; a < e.length; a++) {
                    var i = e[a];
                    if (i in t) return t[i]
                }
            return r
        }, a.getErrorCodesFromErrorDetails = function(e) {
            return _.flatMap(e, function(e, t) {
                return _.map(e, function(e) {
                    var i = e.error;
                    return t + ":" + i
                })
            })
        }
    }), angular.module("udacity.common").service("GlobalAlertsService", ["AlertBoxService", "AGREEMENT_URL", "LATEST_AGREEMENT_VERSION", "AGREEMENT_DEADLINE", function(e, t, i, n) {
        var r = this;
        r._agreementDeadline = function() {
            return n
        }, r.displayAnyTermsAlerts = function(e) {
            e.accepted_terms ? e.agreement_version < i && r.alertNewTos() : r.alertTermsNotAccepted()
        }, r.alertNewTos = function() {
            var i = r._agreementDeadline();
            e.setNowMessage(_.template('We\'ve updated our Udacity Mentor Agreement. Please read and agree to the <a href="${AGREEMENT_FORM_URL}" target="blank">new terms</a> by ${DEADLINE} in order to continue work past that date.')({
                AGREEMENT_FORM_URL: t,
                DEADLINE: i.format("dddd, MMMM Do, YYYY")
            }), {
                messageType: "notification",
                timeout: null
            })
        }, r.alertTermsNotAccepted = function() {
            e.setNowMessage(_.template('You have not accepted the latest version of the Udacity Mentor Agreement. Please read and agree to the <a href="${AGREEMENT_FORM_URL}" target="blank">new terms</a> to continue work.')({
                AGREEMENT_FORM_URL: t
            }), {
                messageType: "error",
                timeout: null
            })
        }
    }]), angular.module("udacity.common").service("LanguageService", ["$http", "$translate", "UsersModel", "UDACITY_USERS_API_URL", function(e, t, i, n) {
        function r(e) {
            if (!e.data.objects) return t.fallbackLanguage();
            var i = _.find(e.data.objects, ["name", "preferred_language"]);
            return i.value ? i.value.toLowerCase() : t.fallbackLanguage()
        }
        var o = this,
            a = null,
            s = {
                "en-us": "English",
                "pt-br": "PortuguÃªs",
                "zh-cn": "ä¸­æ–‡"
            };
        o.supportedLanguages = function() {
            return s
        }, o.fetchUserLanguage = function(t) {
            return e.get(n + "/me/preferences").then(function(e) {
                return r(e)
            })
        }, o.setUserLanguage = function() {
            return a || (a = i.fetch().then(function(e) {
                var i = e.data;
                return o.fetchUserLanguage(i.udacity_key).then(function(e) {
                    return t.use(e).then(function() {
                        return t.use()
                    })
                })
            })), a
        }, o.convertToSupportedLanguage = function(e) {
            var t = _.find(_.keys(s), function(t) {
                return t.slice(0, 2) === e.replace(/(-|_).*/, "")
            });
            return t
        }
    }]), angular.module("udacity.common").service("LoadingService", function() {
        var e, t = this;
        t.setScope = function(t) {
            e = t
        }, t.setLoading = function(t) {
            e && e.setLoading(t)
        }
    }), angular.module("udacity.common").service("MarkdownTextHelper", function() {
        function e(e) {
            return r(e) ? new RegExp("!\\[.+\\]\\(" + n(e.name) + "\\)") : new RegExp("\\[.+\\]\\(" + n(e.name) + "\\)")
        }

        function t(e, t) {
            return i(e, t, e.name)
        }

        function i(e, t, i) {
            return (r(e) ? "!" : "") + "[" + t + "](" + i + ")"
        }

        function n(e) {
            return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
        }

        function r(e) {
            return e.type.match(/image\/.*/)
        }
        var o = this;
        o.insertFileUploading = function(e, i) {
            var n = t(i, "Uploading");
            return e.length > 0 && (e += "\n"), e += n
        }, o.updateFileUploadingStatus = function(i, n, r) {
            var o = t(n, r),
                a = e(n);
            return i.replace(a, o)
        }, o.replaceFileUploadingWithFileLink = function(t, n, r) {
            var o = i(n, n.name, r),
                a = e(n);
            return t.replace(a, o)
        }
    }), angular.module("udacity.common").config(function() {
        var e = new marked.Renderer;
        e.image = function(e, t, i) {
            var n = marked.Renderer.prototype.image.call(this, e, t, i);
            return '<a href="' + e + '" target="_blank">' + n + "</a>"
        }, e.link = function(e, t, i) {
            var n = marked.Renderer.prototype.link.call(this, e, t, i),
                r = $(n).attr("target", "_blank");
            return r.get(0).outerHTML
        }, marked.setOptions({
            renderer: e,
            highlight: function(e) {
                return hljs.highlightAuto(e).value
            },
            sanitize: !0,
            gfm: !0,
            breaks: !0,
            emoji: function(e) {
                var t = e.split("|"),
                    i = t[0],
                    n = t[1] || "";
                return n && (n = " animated slower infinite " + escape(n)), ['<img src="', "/assets/images/emojis/", encodeURIComponent(i), '.png"', ' alt=":', escape(i), ':"', ' title=":', escape(i), ':"', ' class="emoji', n, '"/>'].join("")
            }
        })
    }), angular.module("udacity.common").run(function() {
        moment.locale("en", {
            relativeTime: {
                future: "%s",
                past: "%s ago",
                s: "1s",
                m: "1m",
                mm: "%dm",
                h: "1h",
                hh: "%dh",
                d: "1d",
                dd: function(e) {
                    var t = Math.round(e / 7);
                    return e < 7 ? e + " days" : 1 === t ? "1 week" : t + " weeks"
                },
                M: "1 month",
                MM: "%d months",
                y: "1y",
                yy: "%dy"
            },
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "MM/DD/YYYY",
                LL: "MMM D, YYYY",
                LLL: "MMMM Do YYYY LT",
                LLLL: "dddd, MMMM Do YYYY LT"
            }
        })
    }), angular.module("udacity.common").provider("PageContextProvider", function() {
        var e = {
                headerURL: "common/templates/header.tmpl.html",
                footerURL: "common/templates/footer.tmpl.html"
            },
            t = angular.copy(e);
        return {
            $get: ["$rootScope", "$location", function(i, n) {
                return i.$on("$locationChangeStart", function() {
                    angular.extend(t, e)
                }), t
            }]
        }
    }), angular.module("udacity.common").service("SmyteService", ["SMYTE_CLIENT_KEY", function(e) {
        var t = this;
        this.SUBMISSION_REVIEWING = "submission_reviewing", t.init = function(t) {
            ! function(e, t, i, n, r) {
                e._smyte = e._smyte || [], n = t.createElement(i), n.async = 1, n.src = "//ping.smyte.com/p.js", r = t.getElementsByTagName(i)[0], r.parentNode.insertBefore(n, r)
            }(window, document, "script"), _smyte.push(["_setClientKey", e]), _smyte.push(["_setSession", {
                id: Math.random().toString(36),
                actor: t
            }]), _smyte.push(["_log"])
        }, t.log = function(e, t) {
            _smyte && _smyte.push(["_log", {
                name: e,
                data: t
            }])
        }
    }]), angular.module("udacity.common").service("TermsNotAcceptedInterceptor", ["$q", "ApiUrlHelper", "GlobalAlertsService", function(e, t, i) {
        var n = this;
        n.responseError = function(t) {
            return 409 === t.status && "terms_not_accepted" == t.data.error_code && i.alertTermsNotAccepted(), e.reject(t)
        }
    }]), angular.module("udacity.projects").controller("InReviewCtrl", ["$rootScope", "$scope", "$q", "$stateParams", "REVIEWS_URL", "UsersModel", "LoadingService", "$window", "REVIEWS_V2_URL", function(e, t, i, n, r, o, a, s, u) {
        var c = u + "/submitted";
        s.location.href = c
    }]), angular.module("udacity.projects").controller("InstructionsCtrl", ["$scope", "$stateParams", "LoadingService", "RubricsModel", function(e, t, i, n) {
        i.setLoading(!0), n.fetch(t.rubricId, {
            params: {
                for_eligible_grader: 1
            }
        }).then(function(t) {
            e.rubric = t.data
        })["finally"](function() {
            i.setLoading(!1)
        })
    }]), angular.module("udacity.projects").controller("ReviewerBioModalCtrl", ["$scope", "$uibModalInstance", "mentor", function(e, t, i) {
        e.mentor = i
    }]), angular.module("udacity.projects").controller("RubricCtrl", ["$q", "$scope", "$stateParams", "$translate", "CertificationsModel", "LanguageService", "LoadingService", "RubricsModel", "marked", function(e, t, i, n, r, o, a, s, u) {
        var c = i.rubricId,
            l = this;
        l.rubric = null, l.hideCriteria = !1, l.supportedLanguages = o.supportedLanguages(), l.reviewerTips = !1, a.setLoading(!0), s.fetch(c, {
            params: {
                for_eligible_grader: 1
            }
        }).then(function(e) {
            l.rubric = e.data, l.hideCriteria = l.rubric.hide_criteria, t.shouldShowReviewerTips(l.rubric.project_id).then(function(e) {
                l.reviewerTips = e
            })["finally"](a.setLoading(!1))
        }), t.localize = function(e, t, i) {
            if (e) {
                var r = e.translations,
                    o = r && r[n.use()] && r[n.use()][t],
                    a = o || e[t];
                return i && a ? u(a) : a
            }
        }, t.shouldShowReviewerTips = function(i) {
            return t.isStaff ? e.when(!0) : t.isCertifiedGrader(i)
        }, t.isCertifiedGrader = function(e) {
            return r.fetchMyCertifications().then(function(t) {
                var i = {
                    project_id: e,
                    status: "certified"
                };
                return !_.isEmpty(_.filter(t.data, i))
            })
        }
    }]), angular.module("udacity.projects").controller("ShareReviewCtrl", ["$scope", "$q", "$stateParams", "SubmissionsModel", "ProjectsModel", "RubricsModel", "CritiquesAccessor", "CritiquesModel", "PageContextProvider", "LoadingService", function(e, t, i, n, r, o, a, s, u, c) {
        var l = i.submissionId;
        u.headerURL = "projects/templates/share-review-header.tmpl.html", c.setLoading(!0);
        var d = n.fetch(l).then(function(i) {
                return e.submission = i.data, t.all([r.fetchWithNanodegree(e.submission.project.id).then(function(t) {
                    e.project = t.data
                }), o.fetch(e.submission.rubric_id, {
                    params: {
                        for_eligible_grader: 0
                    }
                }).then(function(t) {
                    e.rubric = t.data
                })])
            }),
            m = s.allForSubmission(l).then(function(t) {
                var i = t.data;
                e.critiquesAccessor = new a(i), e.doesNotMeetCount = _.filter(e.critiquesAccessor.getCritiques(), {
                    result: "failed"
                }).length
            });
        t.all([d, m]).then(function() {
            c.setLoading(!1)
        })
    }]), angular.module("udacity.projects").controller("ShowCtrl", ["$stateParams", "$state", "$location", "RubricsModel", "SubmissionsModel", function(e, t, i, n, r) {
        function o(e, n) {
            var r, o = e.id,
                a = n && n.status,
                s = {};
            switch (a) {
                case "completed":
                    return s.submissionId = n.id, t.go("reviews-show", s);
                case "delaying_review":
                case "processing":
                case "awaiting_review":
                case "in_review":
                case "escalated":
                    return s.rubricId = o, t.go("rubrics.in-review", s);
                case "canceled":
                default:
                    return s.rubricId = o, t.go("rubrics.start", s)
            }
            i.path(r)
        }
        n.fetch(e.rubricId, {
            params: {
                for_eligible_grader: 0
            }
        }).then(function(e) {
            var t = e.data;
            r.fetchMyLatestRubricSubmission(t.id).then(function(e) {
                var i = e.data;
                o(t, i)
            })
        }, function() {
            i.path("/error")
        })
    }]), angular.module("udacity.projects").controller("ShowReviewCtrl", ["$rootScope", "$scope", "$state", "$location", "$stateParams", "$q", "$uibModal", "$window", "store", "ApiUrlHelper", "UsersModel", "ProjectsModel", "EntitlementsModel", "EnrollmentsModel", "CommunityRoomsModel", "RubricsModel", "SubmissionsModel", "StudentFeedbacksModel", "CritiquesModel", "CritiquesAccessor", "ContentsModel", "LoadingService", "CodeReviewService", function(e, t, i, n, r, o, a, s, u, c, l, d, m, f, p, h, g, b, v, y, w, C, S) {
        function R() {
            t.showStudentFeedback = !1, D = !1;
            var e = a.open({
                templateUrl: "projects/templates/student-feedback-modal.tmpl.html",
                controller: "StudentFeedbackModalCtrl",
                controllerAs: "ctrl",
                resolve: {
                    score: function() {
                        return t.studentFeedback.rating
                    },
                    submission: function() {
                        return t.submission
                    }
                }
            });
            return e.result.then(function() {
                t.showStudentFeedback = !1
            })["catch"](function() {
                t.showStudentFeedback = !0, t.studentFeedback.rating = 0
            })
        }

        function U(e) {
            return h.fetch(e, {
                params: {
                    for_eligible_grader: 0
                }
            }).then(function(e) {
                t.currentRubric = e.data, t.hashtag = "" !== e.data.hashtag ? e.data.hashtag : "Nanodegree"
            })
        }

        function I(e) {
            return d.fetchWithNanodegree(e).then(function(e) {
                t.currentProject = e.data, t.currentProject.is_career || (t.careerPortalUrl = c.getCareerPortalLink())
            })
        }

        function A(e) {
            return v.allForSubmission(e).then(function(e) {
                var i = e.data;
                t.critiquesAccessor = new y(i), t.hasFeedback = t.critiquesAccessor.getSections().length > 0, t.doesNotMeetCount = _.filter(t.critiquesAccessor.getCritiques(), {
                    result: "failed"
                }).length
            })
        }

        function M(e, i) {
            return g.fetchUserSubmissions(e, i).then(function(e) {
                t.pastReviews = e.data, t.showPastReviews = !_.every(t.pastReviews, function(e) {
                    return e.id === parseInt(F)
                })
            })
        }

        function $() {
            D = !0, e.$on("$stateChangeStart", function(e, n, r) {
                D && t.submission.result && (e.preventDefault(), R().then(function() {
                    i.go(n.name, r)
                }))
            })
        }

        function k(e, i) {
            return e && i.is_career ? l.fetchReviewer(e).then(function(e) {
                t.hasMentor = !0, t.mentor = e.data, _.isNull(t.mentor.avatar_url) && (t.mentor.avatar_url = O), _.isNull(t.mentor.bio) && (t.mentor.bio = "This reviewer has not added a bio.")
            }) : void 0
        }

        function E(e) {
            return m.fetchMyEntitlements(e, !0).then(function(e) {
                t.hasActiveEntitlement = !_.isEmpty(e.data)
            })
        }

        function T(e) {
            return e ? f.fetchEnrollment(e).then(function(e) {
                t.enrollment = e.data
            })["catch"](function(e) {
                403 !== e.status && console.warn(e)
            }) : o.resolve(null)
        }

        function L(e) {
            return e ? p.fetchCommunityRoom(e).then(function(e) {
                t.communityRoom = e.data
            })["catch"](function(e) {
                404 !== e.status && console.warn(e)
            }) : o.resolve(null)
        }

        function q(e) {
            return b.fetchBySubmissionId(e).then(function() {
                D = !1, t.showStudentFeedback = !1
            })["catch"](function(e) {
                404 === e.status && t.submission.result ? (t.showStudentFeedback = !0, !t.isUngradeable() && t.currentProject && $()) : t.showStudentFeedback = !1
            })
        }

        function j() {
            var e = null;
            e = n.search().audit ? "audit" : t.hasFeedback ? "feedback" : "code", t.showTab(e)
        }
        var P, x = null,
            N = null,
            F = r.submissionId,
            D = !1,
            B = "hasViewedResubmissionVideo",
            O = "https://s3-us-west-2.amazonaws.com/udacity-profiles/assets/default_profile_picture.png",
            z = "https://classroom.udacity.com";
        C.setLoading(!0), l.fetch().then(function(e) {
            x = e.data, N = x.id;
            var r = [];
            r.push(g.fetch(F).then(function(e) {
                if (!e.data) return void n.path("/error");
                var r = e.data;
                return t.submission = r, r.user_id === N && "completed" !== r.status && i.go("rubrics.in-review", {
                    rubricId: r.rubric_id
                }), t.annotation_link = _.head(r.annotation_urls), o.all([I(r.project.id), U(r.rubric_id), A(r.id), M(r.user_id, r.rubric_id), k(r.grader_id, r.project), E(r.project_id), T(r.enrollment_id), L(r.rubric_id)])
            })), r.push(w.all(F).then(function(e) {
                t.files = e.data, t.commentsCount = _.reduce(t.files, function(e, t) {
                    return e + t.comments_count
                }, 0)
            })), o.all(r).then(function() {
                N === t.submission.user_id && q(t.submission.id), t.showCode = S.filterSupportedFiles(t.files).length > 0, j()
            })["finally"](function() {
                C.setLoading(!1)
            })
        }), t.auditTabState = {}, t.showTab = function(e) {
            P = e
        }, t.assignAudit = function() {
            confirm("You are going to assign yourself an audit. Do you really want this?") && g.createAudit(F).then(function() {
                i.go("reviews-show", {
                    submissionId: F,
                    audit: 1
                })
            })
        }, t.userCanCreateAudits = function() {
            return !1
        }, t.isCurrentTab = function(e) {
            return P === e
        }, t.shouldShowAssessmentFooter = function() {
            return t.isResubmittable() || t.showStudentFeedback
        }, t.isSubmissionGradedByCurrentUser = function() {
            var e = t.submission && t.submission.grader_id;
            return e === N
        }, t.isSubmissionByCurrentUser = function() {
            var e = t.submission && t.submission.user_id;
            return e === N
        }, t.isUngradeable = function() {
            return t.submission && "ungradeable" === t.submission.result
        }, t.isStudentHubEligible = function() {
            return !(!t.enrollment || t.enrollment.high_touch || !t.communityRoom || !t.communityRoom.url)
        }, t.isResubmittable = function() {
            return !!t.currentProject && (t.submission && t.isSubmissionByCurrentUser() && _.includes(["failed", "ungradeable"], t.submission.result))
        }, t.shouldShowResubmissionVideo = function() {
            return t.isResubmittable()
        }, t.displayReviewerBioModal = function() {
            var e = a.open({
                templateUrl: "projects/templates/reviewer-bio-modal.tmpl.html",
                controller: "ReviewerBioModalCtrl",
                controllerAs: "ctrl",
                resolve: {
                    mentor: function() {
                        return t.mentor
                    }
                }
            });
            return e.result.then(function() {})["catch"](function() {})
        }, t.studentFeedback = {
            rating: 0
        }, t.$watch("studentFeedback.rating", function() {
            t.studentFeedback.rating && R()
        }), t.hasViewedResubmissionVideo = function() {
            return u.get(B)
        }, t.showResubmissionVideo = function() {
            u.set(B, !0), a.open({
                templateUrl: "projects/templates/resubmission-video-modal.tmpl.html",
                size: "lg",
                windowClass: "embedded-video-640x360"
            })
        }, t.showStudentFeedback = !1, t.goToClassroomPath = function() {
            var e;
            e = t.currentProject.is_career ? t.submission.classroom_project_url || c.getCareerPortalLink(t.currentProject.id) : t.submission.classroom_project_url || z + "/nanodegrees/" + t.submission.enrollment_node_key, D && t.submission.result ? R().then(function() {
                s.location.href = e
            }) : s.location.href = e
        }, t.goToStudentHubLink = function() {
            t.communityRoom && t.communityRoom.url && (analytics.track("Reviews directs to Student Hub", {
                submission_id: t.submission.id
            }, t.$root.segmentPageProperties), s.location.href = t.communityRoom.url)
        }, t.goToCareerPortal = function() {
            s.location.href = t.careerPortalUrl
        }, t.hashtag = ""
    }]), angular.module("udacity.projects").controller("StartCtrl", ["$scope", "$stateParams", "$state", "RubricsModel", "ProjectsModel", "LoadingService", "EntitlementsModel", function(e, t, i, n, r, o, a) {
        var s = this;
        s.rubricId = t.rubricId, s.rubricLanguage = "", s.projectName = null, s.uploadTypes = [], s.alternateRubrics = [], o.setLoading(!0), n.fetch(s.rubricId, {
            params: {
                for_eligible_grader: 0
            }
        }).then(function(e) {
            var t = e.data;
            return s.projectName = t.project.name, s.rubricLanguage = t.language, 1 === t.upload_types.length ? s.redirectToSubmitMethod(t.upload_types[0]) : s.uploadTypes = t.upload_types, t
        }).then(function(e) {
            return e.project.entitlement_required ? a.check(e.project_id).then(function() {
                return e.classroom_project_key
            }) : e.classroom_project_key
        }).then(n.fetchAlternates).then(function(e) {
            s.alternateRubrics = e.data, o.setLoading(!1)
        }, function(e) {
            s.alternateRubrics = [], o.setLoading(!1)
        }), s.hasUploadType = function(e) {
            return s.uploadTypes.indexOf(e) >= 0
        }, s.redirectToSubmitMethod = function(e) {
            var t = {
                rubricId: s.rubricId
            };
            "zip" === e ? i.go("rubrics.submit-zip", t) : "repo" === e ? i.go("rubrics.submit-repo", t) : "file" === e ? i.go("rubrics.submit-file", t) : "link" === e ? i.go("rubrics.submit-link", t) : "text" === e && i.go("rubrics.submit-text", t);
        }, s.redirectToDifferentRubric = function(e) {
            if (e !== s.rubricId) {
                var t = {
                    rubricId: e
                };
                i.go("rubrics.start", t)
            }
        }, s.displayLanguage = function(e) {
            var t = {
                "en-us": "English",
                "pt-br": "PortuguÃªs",
                "zh-cn": "ä¸­æ–‡",
                ar: "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©"
            };
            return t[e ? e : "en-us"] || e
        }
    }]), angular.module("udacity.projects").controller("StudentFeedbackModalCtrl", ["$scope", "$uibModalInstance", "StudentFeedbacksModel", "submission", "score", function(e, t, i, n, r) {
        var o = this;
        o.submission = n, o.score = r, o.isRadioRequired = function() {
            return 5 !== o.score && !o.reason
        }, e.$watch("ctrl.score", function(t, i) {
            0 === t && (e.ctrl.score = i)
        }), o.submitFeedback = function() {
            5 === o.score && (o.reason = void 0);
            var e = {
                rating: o.score,
                reason: o.reason,
                body: o.feedback
            };
            i.create(o.submission.id, e).then(function() {
                t.close()
            })["catch"](function() {
                t.close()
            })
        }
    }]), angular.module("udacity.projects").controller("SubmitLinkCtrl", ["$q", "$scope", "$stateParams", "$state", "SubmissionsModel", "RubricsModel", "UsersModel", "LoadingService", "EntitlementsModel", function(e, t, i, n, r, o, a, s, u) {
        var c = i.rubricId,
            l = this;
        l.user = {}, l.rubricId = c, l.submission = {}, l.isValid = !1;
        var d = [];
        d.push(a.fetch().then(function(e) {
            l.user = e.data
        })), s.setLoading(!0), d.push(o.fetch(l.rubricId).then(function(e) {
            var t = e.data;
            if (l.canaryEnabled = t.canary_enabled, l.canaryMetadata = t.canary_metadata, l.submission.language = t.language || "en-us", l.isCareer = t.project.is_career, t.project.entitlement_required) return u.check(t.project_id)
        })), d.push(r.fetchMyLatestRubricSubmission(c).then(function(e) {
            var t = e.data;
            t && (l.url = t.url)
        })), e.all(d)["finally"](function() {
            s.setLoading(!1)
        }), t.$watch("ctrl.submission.url", function() {
            l.isValid = !!l.submission.url
        }), l.createSubmission = function() {
            return r.createWithUrl(c, l.submission).then(function() {
                var e = {
                    rubricId: c
                };
                n.go("rubrics.in-review", e)
            })
        }
    }]), angular.module("udacity.projects").controller("SubmitRepoCtrl", ["$scope", "$stateParams", "$state", "$q", "UsersModel", "SubmissionsModel", "RubricsModel", "LoadingService", "EntitlementsModel", function(e, t, i, n, r, o, a, s, u) {
        var c = "https://github.com/",
            l = t.rubricId,
            d = this;
        d.user = {}, d.rubricId = l, d.selectedRepoFullName = null, d.submission = {}, d.repos = [], d.isValid = !1, s.setLoading(!0);
        var m = [];
        m.push(r.fetch().then(function(e) {
            d.user = e.data
        })), m.push(r.fetchRepos().then(function(e) {
            d.repos = e.data
        })), m.push(o.fetchMyLatestRubricSubmission(l).then(function(e) {
            var t = e.data;
            t && (d.selectedRepoFullName = t.repo_url && t.repo_url.replace(c, ""))
        })), m.push(a.fetch(d.rubricId, {
            params: {
                for_eligible_grader: 0
            }
        }).then(function(e) {
            var t = e.data;
            if (d.canaryEnabled = t.canary_enabled, d.canaryMetadata = t.canary_metadata, d.submission.language = t.language || "en-us", d.isCareer = t.project.is_career, t.project.entitlement_required) return u.check(t.project_id)
        })), n.all(m)["finally"](function() {
            s.setLoading(!1)
        }), e.$watch("ctrl.selectedRepoFullName", function() {
            d.isValid = !!d.selectedRepoFullName, d.submission.repo_url = d.isValid ? c + d.selectedRepoFullName : null
        }), d.hasRepos = function() {
            return !!(d.repos && d.repos.length > 0)
        }, d.createSubmission = function() {
            return o.createWithRepo(l, d.submission).then(function() {
                var e = {
                    rubricId: l
                };
                i.go("rubrics.in-review", e)
            })
        }
    }]), angular.module("udacity.projects").controller("SubmitTextCtrl", ["$scope", "$q", "$stateParams", "$state", "$window", "SubmissionsModel", "RubricsModel", "UsersModel", "ErrorHelper", "EntitlementsModel", function(e, t, i, n, r, o, a, s, u, c) {
        function l(e, t, i, n) {
            if (t = t || 75, i = i || "\n", n = n || !1, !e) return e;
            var r = ".{1," + t + "}(\\s|$)" + (n ? "|.{" + t + "}|.+$" : "|\\S+?(\\s|$)");
            return e.match(RegExp(r, "g")).join(i)
        }
        var d = this,
            m = i.rubricId;
        d.user = {}, d.submission = {}, d.rubricId = m, d.isValid = !1, d.editing = !0, e.loading = !0;
        var f = [];
        f.push(s.fetch().then(function(e) {
            d.user = e.data
        })), f.push(a.fetch(m, {
            params: {
                for_eligible_grader: 0
            }
        }).then(function(e) {
            var t = e.data;
            if (d.submission.language = t.language || "en-us", t.project.entitlement_required) return c.check(t.project_id)
        })), t.all(f)["finally"](function() {
            e.loading = !1
        });
        var p = i.template;
        d.syntax = "html", "md" === i.filetype && (d.syntax = "markdown"), _.isEmpty(p) || (d.text = p), _.isEmpty(i.filename) || (d.filename = i.filename), d.toggleEdit = function() {
            d.editing = !d.editing
        }, d.isValid = function() {
            return !_.isEmpty(d.text) && d.text !== p
        }, d.createSubmission = function() {
            d.fileErrorMessage = null;
            var e = "html" === d.syntax ? ".html" : ".md";
            if (_.isEmpty(d.filename) ? d.filename = "readme" + e : d.filename.toLowerCase().endsWith(e) || (d.filename += e), _.isEmpty(d.text)) return t.when();
            var i = l(d.text);
            return o.createWithText(m, d.submission, d.filename, i).then(function() {
                var e = {
                    rubricId: m
                };
                n.go("rubrics.in-review", e)
            })["catch"](function(e) {
                d.fileErrorMessage = u.translateResponse(e)
            })
        }
    }]), angular.module("udacity.projects").controller("SubmitZipCtrl", ["$q", "$scope", "$stateParams", "$state", "SubmissionsModel", "RubricsModel", "UsersModel", "LoadingService", "ErrorHelper", "EntitlementsModel", function(e, t, i, n, r, o, a, s, u, c) {
        t.zipImgSource = "/assets/images/upload-zip.svg", t.pdfImgSource = "/assets/images/upload-file.svg", t.archiveHeader = "Upload your archive";
        var l, d = {
            archive: {
                ext: ["zip"],
                accept: "application/zip,application/x-zip,application/x-zip-compressed"
            },
            pdf: {
                ext: ["pdf", "zip", "md", "html"],
                accept: "application/zip,application/x-zip,application/x-zip-compressed,application/pdf,text/markdown,text/x-markdown,text/html,.md"
            }
        };
        "rubrics.submit-zip" === n.current.name ? (t.fileType = "archive", l = d.archive.ext, t.acceptHeader = d.archive.accept) : (t.fileType = "pdf", l = d.pdf.ext, t.acceptHeader = d.pdf.accept);
        var m = this;
        m.user = {}, m.submission = {}, m.rubricId = i.rubricId, m.rubric = null, m.isValid = !1, m.submitBtnText = "Submit", s.setLoading(!0);
        var f = [];
        f.push(o.fetch(m.rubricId, {
            params: {
                for_eligible_grader: 0
            }
        }).then(function(e) {
            if (m.rubric = e.data, m.canaryEnabled = m.rubric.canary_enabled, m.canaryMetadata = m.rubric.canary_metadata, m.isCareer = m.rubric.project.is_career, m.submission.language = m.rubric.language || "en-us", m.rubric.entitlement_required) return c.check(m.rubric.project_id)
        })), f.push(a.fetch().then(function(e) {
            m.user = e.data
        })), e.all(f)["finally"](function() {
            s.setLoading(!1)
        }), t.$watch("ctrl.genericFiles", function() {
            m.fileErrorMessage = null, m.isValid = !1;
            var e = m.getSelectedFile();
            if (e) {
                if (e.size > 1024 * m.rubric.max_upload_size_mb * 1024) return void(m.fileErrorMessage = u.fetchErrorMessage("zipfile:too_big"));
                var t = e.name.toLowerCase().split(".");
                return l.indexOf(t[t.length - 1]) === -1 ? void(m.fileErrorMessage = u.fetchErrorMessage("zipfile:bad_extension")) : void(m.isValid = !0)
            }
        }), m.getSelectedFile = function() {
            return m.genericFiles && m.genericFiles[0]
        }, m.createSubmission = function() {
            m.fileErrorMessage = null;
            var e, i = m.getSelectedFile().name.toLowerCase().split("."),
                o = i[i.length - 1];
            return e = "archive" === t.fileType || "zip" === o ? r.createWithZipFile(m.rubricId, m.submission, m.getSelectedFile()) : r.createWithFiles(m.rubricId, m.submission, [m.getSelectedFile()]), e.then(function() {
                var e = {
                    rubricId: m.rubricId
                };
                n.go("rubrics.in-review", e)
            })["catch"](function(e) {
                m.fileErrorMessage = u.translateResponse(e)
            })
        }
    }]), angular.module("udacity.projects").directive("auditTab", function() {
        return {
            controller: "AuditTabCtrl",
            templateUrl: "projects/directives/audit-tab.tmpl.html",
            scope: {
                submission: "=",
                state: "="
            },
            restrict: "A"
        }
    }).controller("AuditTabCtrl", ["$scope", "$state", "$stateParams", "$uibModal", "CritiquesAccessor", "UsersModel", "AlertBoxService", "CritiquesModel", "AuditsModel", "SubmissionsModel", "ErrorHelper", function(e, t, i, n, r, o, a, s, u, c, l) {
        function d(t) {
            e.audit = t, e.isOnboardingAudit = !(!e.submission || !e.submission.training_id), f(t) ? s.allForAudit(t.id).then(function(i) {
                var n = i.data;
                e.auditCritiquesAccessor = new r(n), e.auditEditable = h(t) && "in_review" === t.status, e.isAuditor = h(t), m("visible", !0), p(t) && g(t)
            }) : (e.auditCritiquesAccessor = null, e.auditEditable = !1, m("visible", !1))
        }

        function m(t, i) {
            e.state && (e.state[t] = i)
        }

        function f(e) {
            return e && (h(e) || e.result)
        }

        function p(e) {
            return e.user_id === b
        }

        function h(e) {
            return e.grader_id === b
        }

        function g(e) {
            e.read_at || u.markAsRead(e.id)
        }
        var b = null;
        o.fetch().then(function(e) {
            b = e.data.id
        }), e.audit = null, e.isAuditor = !1, e.auditCritiquesState = {
            audit: !0
        }, e.confirmSubmitAudit = function() {
            return n.open({
                templateUrl: "projects/templates/confirm-audit-modal.tmpl.html"
            }).result.then(function() {
                return e.submitAudit()
            }, function() {
                return !0
            })
        }, e.submitAudit = function() {
            return e.auditEditable = !1, u.submit(e.audit.id).then(function() {
                a.setNextMessage("Audit successfully submitted."), t.go("submissions.dashboard", {
                    submitted: !0
                })
            })
        }, e.reviseReview = function() {
            return c.reviseReview(i.submissionId).then(function(e) {
                t.go("submissions.show", {
                    submissionId: e.data.id
                })
            }, function(e) {
                alert(l.translateResponse(e.data))
            })
        }, e.isComplete = function() {
            return e.isOnboardingAudit ? !e.auditCritiquesState.editing : e.auditCritiquesState.partlyComplete
        }, e.$watch("submission", function() {
            e.submission ? u.fetchBySubmissionId(e.submission.id, {
                passthrough403: !0
            }).then(function(e) {
                d(e.data)
            }, function() {
                d(null)
            }) : d(null)
        })
    }]), angular.module("udacity.projects").directive("createSubmissionForm", function() {
        return {
            controller: "CreateSubmissionFormCtrl",
            controllerAs: "ctrl",
            templateUrl: "projects/directives/create-submission-form.tmpl.html",
            transclude: !0,
            scope: {
                submission: "=",
                rubricId: "=",
                githubRequired: "=",
                transclusionValid: "=",
                submit: "&",
                submitBtnText: "=",
                canaryEnabled: "=",
                canaryMetadata: "=",
                isCareer: "="
            },
            restrict: "A"
        }
    }).controller("CreateSubmissionFormCtrl", ["$scope", "$q", "$location", "SubmissionsModel", "CritiquesModel", "UsersModel", "RubricItemsModel", "ErrorHelper", function(e, t, i, n, r, o, a, s) {
        var u = this;
        u.submission = e.submission, u.submitBtnText = e.submitBtnText, u.myWorkTermsAccepted = !1, u.attributionTermsAccepted = !1, u.plagiarismTermsAccepted = !1, u.visibilityTermsAccepted = !1, u.unitTestAnswer = null, u.warningClass = "test-warning-hidden", u.errorClass = "test-warning-hidden", u.idIncluded = !1, u.isLoading = !0, u.hasValidGithubToken = !1, u.githubRequired = e.githubRequired, u.optionalRubricItemsAttempted = null, u.optionalRubricItems = [], u.githubAuthRedirectPath = i.path(), u.studentNotes = "", u.intendedCareer = "";
        var c = [];
        u.githubRequired && c.push(o.fetchGithubAuthorization().then(function(e) {
            var t = e.data;
            u.hasValidGithubToken = t.authorized
        })), c.push(a.allOptional(e.rubricId).then(function(e) {
            u.optionalRubricItems = e.data
        })), t.all(c).then(function() {
            u.isLoading = !1
        }), u.transitionTestWarning = function(e) {
            switch (e) {
                case "warning":
                    u.warningClass = "unit-tests-incomplete warning", u.errorClass = "test-warning-hidden";
                    break;
                case "error":
                    u.errorClass = "unit-tests-incomplete error", u.warningClass = "test-warning-hidden";
                    break;
                case "complete":
                default:
                    u.warningClass = "test-warning-hidden", u.errorClass = "test-warning-hidden"
            }
        }, u.isFormComplete = function(t) {
            if (!t) return !1;
            if (e.isCareer) {
                if (!(u.studentNotes && u.intendedCareer && u.visibilityTermsAccepted && u.plagiarismTermsAccepted)) return !1
            } else if (!u.myWorkTermsAccepted || !u.attributionTermsAccepted || !u.plagiarismTermsAccepted) return !1;
            if (e.canaryEnabled && "yes" !== u.unitTestAnswer) return !1;
            if (!e.isCareer && !_.isEmpty(u.optionalRubricItems))
                if ("yes" === u.optionalRubricItemsAttempted) {
                    if (!_.some(u.optionalRubricItems, {
                            isSelected: !0
                        })) return !1
                } else if (null === u.optionalRubricItemsAttempted) return !1;
            return !0
        }, u.formatStudentNotes = function(e, t) {
            var i = _.trim(u.studentNotes),
                n = _.trim(u.intendedCareer);
            return n ? "Desired Role: " + n + "\r\nAdditional Details: " + i : i
        }, u.submit = function() {
            if (u.submission.notes = u.formatStudentNotes(u.studentNotes, u.intendedCareer), u.errorMessage = null, u.submitBtnText = "Processing...", u.optionalRubricItemsAttempted) {
                var t = _.map(_.filter(u.optionalRubricItems, {
                    isSelected: !0
                }), "id");
                u.submission.optional_rubric_items_attempted = t
            } else u.submission.optional_rubric_items_attempted = [];
            return e.submit()["catch"](function(e) {
                u.errorMessage = s.translateResponse(e)
            })["finally"](function() {
                u.submitBtnText = "Submit"
            })
        }, e.$watch("ctrl.optionalRubricItemsAttempted", function() {
            "no" === u.optionalRubricItemsAttempted && _.each(u.optionalRubricItems, function(e) {
                e.isSelected = !1
            })
        })
    }]), angular.module("udacity.projects").directive("githubAuth", ["$window", "UsersModel", "GITHUB_URI", function(e, t, i) {
        var n = function(e) {
            e.isLoading = !0, e.scrollToConnect = function() {
                $("html, body").animate({
                    scrollTop: $("#connecting-your-account").offset().top
                }, 200)
            }, t.fetch().then(_.bind(function(t) {
                var i = t.data;
                e.githubAuthUrl = this.getGithubAuthUrl(i.id, e.redirectPath), e.isLoading = !1
            }, this))
        };
        return n.$inject = ["$scope"], n.prototype = {
            getGithubAuthUrl: function(t, n) {
                return i + "?user_id=" + t + "&redirect_path=" + e.encodeURIComponent(n)
            }
        }, {
            controller: n,
            templateUrl: "projects/directives/github-auth.tmpl.html",
            scope: {
                redirectPath: "@"
            },
            restrict: "EA"
        }
    }]), angular.module("udacity.projects").directive("rubricItemsSelector", function() {
        return {
            templateUrl: "projects/directives/rubric-items-selector.tmpl.html",
            scope: {
                rubricItems: "="
            },
            restrict: "A"
        }
    }), angular.module("udacity.submissions").directive("socialShare", function() {
        return {
            templateUrl: "projects/directives/social-share.tmpl.html",
            scope: {
                buttonHashtag: "=",
                userType: "=",
                prompt: "=",
                text: "=",
                url: "="
            },
            controller: "SocialShareController",
            restrict: "A"
        }
    }).controller("SocialShareController", ["$scope", function(e) {
        e.showTwitterPopup = function() {
            var t = [];
            e.buttonHashtag && t.push(["hashtags", e.buttonHashtag]), e.text && t.push(["text", e.text]), e.url && t.push(["url", e.url]);
            var i = "http://twitter.com/intent/tweet?" + t.map(function(e) {
                return e[0] + "=" + encodeURIComponent(e[1])
            }).join("&");
            analytics.track("Review Tweeted", {
                hashtag: e.buttonHashtag,
                tweeted_by: e.userType
            }, e.$root.segmentPageProperties), e.showPopup(i)
        }, e.showFacebookPopup = function() {
            var t = "http://facebook.com/sharer/sharer.php?u=" + encodeURIComponent(e.url);
            analytics.track("Review Shared", {
                shared_by: e.userType
            }, e.$root.segmentPageProperties), e.showPopup(t)
        }, e.showPopup = function(e) {
            var t = 575,
                i = 400,
                n = window.screenX + ($(window).width() - t) / 2,
                r = window.screenY + ($(window).height() - i) / 2,
                o = "status=1,width=" + t + ",height=" + i + ",top=" + r + ",left=" + n;
            window.open(e, "social-share", o)
        }
    }]), angular.module("udacity.submissions").controller("ApplyCtrl", ["$window", "MENTOR_DASHBOARD_URL", function(e, t) {
        e.location.assign(t + "/apply?services[]=reviews")
    }]), angular.module("udacity.submissions").controller("ConfirmFeedbackModalCtrl", ["$uibModalInstance", "$scope", function(e, t) {
        var i = this,
            n = !0;
        i.nominate = !1, i.nomination = {
            reason: ""
        }, i.submission = t.submission, i.submit = function() {
            e.close({
                nomination: i.nomination.reason
            })
        }, t.$watch("nominate", function() {
            i.nominate || (i.nomination.reason = "")
        }), i.isEditing = function() {
            return n
        }, i.toggleEdit = function() {
            n = !n
        }
    }]), angular.module("udacity.submissions").controller("DashboardCtrl", ["MENTOR_DASHBOARD_URL", function(e) {
        window.location.assign(e + "/reviews/overview#")
    }]), angular.module("udacity.submissions").controller("FooterCtrl", ["$scope", "UsersModel", "AGREEMENT_URL", "HANDBOOK_URL", function(e, t, i, n) {
        t.fetch().then(function(t) {
            e.currentUser = t.data
        }), e.agreementUrl = i, e.handbookUrl = n
    }]), angular.module("udacity.submissions").controller("ProjectsSelectorCtrl", ["$window", "MENTOR_DASHBOARD_URL", function(e, t) {
        e.location.assign(t + "/update")
    }]), angular.module("udacity.submissions").controller("QualitySpecificationsCtrl", ["CODE_AUDIT_RUBRIC_ID", "NOCODE_AUDIT_RUBRIC_ID", "$stateParams", function(e, t, i) {
        var n = this;
        n.codeAuditRubricId = e, n.noCodeAuditRubricId = t, n.noCodeAuditRubricId === parseInt(i.id) ? n.tabName = "noCode" : n.tabName = "withCode", n.showTab = function(e) {
            n.tabName = e
        }, n.isSelectedTab = function(e) {
            return n.tabName === e
        }
    }]), angular.module("udacity.submissions").controller("SubmissionDetailsCtrl", ["$q", "$scope", "$location", "$stateParams", "$state", "$uibModal", "store", "SubmissionsModel", "RubricsModel", "CritiquesModel", "CritiquesAccessor", "ContentsModel", "LoadingService", "AlertBoxService", "SmyteService", "ErrorHelper", "CodeReviewService", "UsersModel", "GlobalAlertsService", "$window", "MENTOR_DASHBOARD_URL", "REVIEWS_V2_URL", "ReviewerToolkitModel", function(e, t, i, n, r, o, a, s, u, c, l, d, m, f, p, h, g, b, v, y, w, C, S) {
        function R() {
            var e = t.isOnboarding() ? "" : " back to Mentor Dashboard";
            f.setNowMessage("Review successfully submitted. Redirecting" + e + "...", {
                timeout: 3e3
            }), t.isOnboarding() ? r.go("submissions.dashboard", {
                tab: "onboarding"
            }) : setTimeout(function() {
                y.location.assign(w + "/reviews/overview")
            }, 3500)
        }
        var U = n.submissionId;
        t.TOOLKIT_VIEW_TIME = "TOOLKIT_VIEW_TIME", m.setLoading(!0);
        var I, A = [],
            M = e.defer(),
            k = e.defer(),
            E = e.defer();
        s.fetchCopyingEvidence(U).then(function(e) {
            var t = e.data.status,
                n = e.data.plagiarism_judgement,
                r = e.data.exhibits,
                o = i.search().skipPlagiarism;
            "completed" !== t && !n && r.length > 0 && !o && y.location.assign(C + "/plagiarism/" + U)
        }), A.push(b.fetch().then(function(e) {
            I = e.data, v.displayAnyTermsAlerts(I)
        })), A.push(d.all(U).then(function(e) {
            t.files = e.data
        })), A.push(M.promise), A.push(k.promise), s.fetch(U).then(function(i) {
            var n = i.data,
                r = n.annotation_urls;
            if (r && r.length) {
                var o = r[0].split("/");
                t.pdfName = o[o.length - 1] + " (Saved)"
            }
            n.url && 0 !== n.url.trim().toLowerCase().indexOf("http") && (n.url = "http://" + n.url.trim()), t.submission = n, t.showLink = !!n.url, t.isOnboardingSubmission = !!n.training_id, u.fetch(n.rubric_id, {
                params: {
                    for_eligible_grader: 1
                }
            }).then(function(e) {
                t.currentRubric = e.data, t.currentProject = t.currentRubric.project, t.currentTab = t.currentProject.is_cert_project ? "resources" : "", k.resolve(t.currentRubric)
            }), S.fetch(n.project.id, n.language).then(function(e) {
                var i = e.data;
                i && (t.toolkit_updated_at = i.updated_at, t.toolkit_url = i.archive_url, t.refreshToolkitBadgeVisibility()), E.resolve(i)
            });
            var a, d, m = [];
            m.push(s.fetchUserSubmissions(n.user_id, n.rubric_id).then(function(e) {
                t.pastReviews = e.data, t.showPastReviews = _.some(t.pastReviews, function(e) {
                    return e.id !== parseInt(U)
                }), t.latestReview = _.every(t.pastReviews, function(e) {
                    return e.id <= parseInt(U)
                });
                var i = _.findIndex(t.pastReviews, function(e) {
                        return e.id === t.submission.id
                    }),
                    n = i + 1 + _.findIndex(t.pastReviews.slice(i + 1), function(e) {
                        return "failed" === e.result
                    });
                a = n <= i ? -1 : e.data[n].id
            })), m.push(c.allForSubmission(U).then(function(e) {
                d = e.data, _.some(d, "autograded") && f.setNowMessage("We've graded some rubric points for this submission. Check the Project Review tab before you start!", {
                    timeout: !1
                })
            })), e.all(m)["finally"](function() {
                if (a !== -1) return c.allForSubmission(a).then(function(e) {
                    var t = e.data;
                    _.each(d, function(e) {
                        var i = _.find(t, function(t) {
                            return t.rubric_item_id === e.rubric_item_id && t.created_at > e.rubric_item.updated_at
                        });
                        i && (e.prev_result = i.result, e.prev_observation = i.observation)
                    })
                })
            }).then(function() {
                t.critiquesAccessor = new l(d), t.hasCritiques = d.length > 0, M.resolve(t.submission)
            })["catch"](console.error)
        }), t.updateToolkitLastView = function() {
            a.set(t.TOOLKIT_VIEW_TIME, moment().valueOf()), t.refreshToolkitBadgeVisibility()
        }, t.getToolkitLastView = function() {
            return a.get(t.TOOLKIT_VIEW_TIME)
        }, t.refreshToolkitBadgeVisibility = function() {
            t.isToolkitBadgeVisible = null === t.getToolkitLastView() || moment(t.getToolkitLastView()) < moment(t.toolkit_updated_at)
        }, t.updatedOnText = function() {
            return moment(t.toolkit_updated_at).format("dddd, MMMM Do, YYYY, h:mm:ss a")
        }, t.isCodeShown = function() {
            return t.submission && !t.submission.url && t.files && g.filterSupportedFiles(t.files).length > 0
        }, t.isAnnotationShown = function() {
            if (!t.submission) return !1;
            if (t.submission.url) return !0;
            var e = _.keyBy(t.files, function(e) {
                var t = e.path.toLowerCase().split(".");
                return t[t.length - 1]
            });
            return !!_.has(e, "pdf") || !!_.has(e, "docx")
        }, e.all(A)["finally"](function() {
            return "staff" != I.role && t.submission.grader_id != I.id ? i.path("/reviews/" + t.submission.id) : (m.setLoading(!1), void("in_review" === t.submission.status && p.log(p.SUBMISSION_REVIEWING, {
                id: U
            })))
        }), t.critiquesState = {}, t.showTab = function(e) {
            t.currentTab = e
        }, t.isSubmissionCompleted = function() {
            return t.submission && "completed" === t.submission.status
        }, t.hasPlagiarizedSubmission = function() {
            return _.some(t.pastReviews, {
                plagiarism_judgement: "confirmed"
            })
        }, t.confirmUnassign = function() {
            o.open({
                templateUrl: "submissions/templates/confirm-unassign-modal.tmpl.html"
            }).result.then(function() {
                return t.unassign()
            })
        }, t.unassign = function() {
            s.unassignSubmission(U).then(function() {
                i.path("/submissions/dashboard")
            })
        }, t.confirmEvaluationSubmit = function() {
            return o.open({
                templateUrl: "submissions/templates/confirm-feedback-modal.tmpl.html",
                controller: "ConfirmFeedbackModalCtrl",
                controllerAs: "ctrl",
                scope: t,
                size: "submit-confirm"
            }).result.then(function(e) {
                return t.submitEvaluation(e)
            }, function() {
                return !0
            })
        }, t.isOnboarding = function() {
            return !(!t.submission || !t.submission.training_id)
        }, t.submitEvaluation = function(e) {
            return s.submitFeedback(U, e).then(function() {
                R()
            })
        }, t.showUngradeableModal = function() {
            o.open({
                templateUrl: "submissions/templates/ungradeable-modal.tmpl.html",
                size: "lg",
                controller: "UngradeableModalCtrl",
                controllerAs: "ctrl",
                resolve: {
                    submission: t.submission,
                    project: t.currentProject
                }
            }).result.then(function() {
                R()
            })
        }, t.moveToAdditionalComment = function() {
            var e = $("#generalComment");
            t.currentTab = "feedback", setTimeout(function() {
                $("html, body").animate({
                    scrollTop: e.offset().top
                }, 500), e.find("textarea").first().focus()
            }, 50)
        }, t.$watch("pdfFile", function() {
            t.pdfErrorMessage = null, t.pdfName = null;
            var e = 10,
                i = _.head(t.pdfFile);
            if (i) {
                var n = 0;
                if (t.files && (n = _.max(_.map(t.files, function(e) {
                        var t = e.path.lastIndexOf(".");
                        if (t === -1) return 0;
                        var i = e.path.slice(t);
                        return _.includes([".pdf", ".docx"], i) ? e.size : 0
                    }))), i.size - n > 1024 * e * 1024) return void(t.pdfErrorMessage = h.fetchErrorMessage("annotations:too_big"));
                var r = i.name.toLowerCase().split(".");
                if ("pdf" !== r[r.length - 1]) return void(t.pdfErrorMessage = h.fetchErrorMessage("annotations:bad_extension"));
                t.pdfName = i.name + " (Uploading...)", s.uploadAnnotations(U, [i]).then(function() {
                    t.pdfName = i.name + " (Saved)"
                })
            }
        })
    }]), angular.module("udacity.submissions").controller("SubmissionStartCtrl", ["$location", "UsersModel", function(e, t) {
        t.fetch().then(function(t) {
            var i = t.data;
            i.accepted_terms ? e.path("/submissions/dashboard") : e.path("/submissions/apply")
        })
    }]), angular.module("udacity.submissions").controller("UngradeableModalCtrl", ["$uibModalInstance", "SubmissionsModel", "submission", "project", function(e, t, i, n) {
        var r = this;
        r.notes = "", r.reasons = [{
            tag: "missing_requirements",
            text: "Missing Requirements"
        }, {
            tag: "language",
            text: "Submission in the wrong language"
        }, {
            tag: "abuse",
            text: "Abusive language or conduct"
        }, {
            tag: "plagiarism",
            text: "Plagiarism"
        }], r.selectedReason = r.reasons[0], r.project = n;
        var o = !0;
        r.submit = function() {
            t.ungradeable(i.id, r.notes, r.selectedReason.tag, r.plagiarismSourceUrl).then(function() {
                e.close()
            })
        }, r.isEditing = function() {
            return o
        }, r.toggleEdit = function() {
            o = !o
        }, r.incomplete = function() {
            return !r.notes || !r.selectedReason
        }, r.shownToStudent = function() {
            return ["plagiarism", "missing_requirements"].includes(r.selectedReason.tag)
        }
    }]), angular.module("udacity.submissions").controller("VoteFeedbackModalCtrl", ["$scope", "SubmissionsModel", "ErrorHelper", function(e, t, i) {
        var n = this;
        n.submissionId = e.voteInProgress.submissionId, n.newValue = e.voteInProgress.newValue, n.placeholder = 1 === n.newValue ? "Why did you like this review?" : "What should this reviewer do to improve?", n.submit = function() {
            var r = e.votes[n.submissionId].feedback;
            t.postVote(n.submissionId, n.newValue, r).then(function(t) {
                e.votes[n.submissionId] = {
                    value: t.data.value,
                    feedback: t.data.feedback
                }, _.defer(function() {
                    e.$apply()
                })
            })["catch"](function(t) {
                e.erred(i.translateResponse(t))
            })["finally"](function() {
                e.$close()
            })
        }
    }]), angular.module("udacity.submissions").filter("submissionAssignmentTimeRemaining", function() {
        return function(e) {
            var t = window.moment,
                i = t(e.assigned_at).add(12, "h"),
                n = i.isAfter(t());
            return n ? i.fromNow() : "0m"
        }
    }), angular.module("udacity.submissions").filter("onboardingStatusLabel", function() {
        var e = {
            passed: ": Completed",
            in_audit: ": Submitted, pending audit"
        };
        return function(t) {
            return e[t]
        }
    }), angular.module("udacity.submissions").directive("auditsList", function() {
        return {
            templateUrl: "submissions/directives/audits-list.tmpl.html",
            scope: {
                audits: "="
            },
            restrict: "A"
        }
    }), angular.module("udacity.submissions").directive("certificationStatus", function() {
        return {
            templateUrl: "submissions/directives/certification-status.tmpl.html",
            scope: {
                certification: "="
            },
            restrict: "A"
        }
    }), angular.module("udacity.submissions").directive("certificationView", function() {
        return {
            templateUrl: "submissions/directives/certification-view.tmpl.html",
            scope: {
                certificationId: "=",
                reviewerOnboardingUnlocked: "="
            },
            controller: "CertificationViewController",
            restrict: "A"
        }
    }).controller("CertificationViewController", ["$scope", "$state", "$q", "COURSE_BASE_URL", "CertificationsModel", "UsersModel", "OnboardingsModel", function(e, t, i, n, r, o, a) {
        function s(e) {
            return _.find(e.training_submissions, {
                status: "in_review"
            })
        }
        e.ONBOARDING_TIME_LIMIT_MESSAGE = "You must complete the onboarding review within 12 hours of starting it.", e.moment = window.moment, e.certification = null, e.loading = !0;
        var u = r.fetch(e.certificationId);
        u.then(function(t) {
            if (e.certification = t.data, _.isEmpty(e.certification.trainings)) {
                e.certification.trainings = [];
                for (var i = 0; i < Math.max(1, e.certification.trainings_count); i++) e.certification.trainings.push({
                    status: "locked"
                })
            }
        }), i.all({
            certifications: u
        }).then(function() {
            e.loading = !1, e.onboardingLocked = !e.reviewerOnboardingUnlocked
        }), e.start = function(e) {
            return a.attempt(e).then(function(e) {
                var i = e.data,
                    n = s(i);
                t.go("submissions.show", {
                    submissionId: n.id
                })
            })
        }, e.submitProjectUrl = function(e) {
            return t.href("rubrics.start", {
                rubricId: e.rubric_id_for_prospective_graders
            })
        }, e.isCertified = function() {
            return _.includes(["certified", "inactive"], e.certification.status)
        }
    }]),
    function() {
        var e = 3e3;
        angular.module("udacity.submissions").directive("studentFeedbacksList", ["StudentFeedbacksModel", function(e) {
            return {
                templateUrl: "submissions/directives/student-feedbacks-list.tmpl.html",
                scope: {
                    allReadCallback: "&"
                },
                restrict: "A",
                controller: "StudentFeedbacksListCtrl",
                controllerAs: "ctrl"
            }
        }]).controller("StudentFeedbacksListCtrl", ["$q", "$scope", "$timeout", "StudentFeedbacksModel", function(t, i, n, r) {
            function o() {
                var e = a(s.studentFeedbacks),
                    n = [];
                _.each(e, function(e) {
                    n.push(r.markAsRead(e).then(function(e) {
                        i.isUpdating = !0;
                        var t = e.data;
                        _.chain(s.studentFeedbacks).find({
                            id: t.id
                        }).extend(t).value()
                    }))
                }), i.allReadCallback && t.all(n).then(function() {
                    i.allReadCallback()
                })
            }

            function a(e) {
                return _.chain(e).filter(function(e) {
                    return !e.read_at
                }).map("id").value()
            }
            var s = this;
            s.studentFeedbacks = [], s.loading = !0, r.all().then(function(t) {
                s.studentFeedbacks = t.data, s.loading = !1, n(o, e)
            })
        }])
    }();
! function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/alert-box.tmpl.html", '<div class="row row-gap-medium" ng-show="!!message && !dismissed" ng-class="{fadeInDown: !!message, fadeOutUp: dismissed, animated: !!message || dismissed}"> <div class="col-md-offset-2 col-md-8"> <div class="alert {{alertClass}} hr-slim"> <button type="button" ng-click="dismiss()" class="close" aria-label="Close"> <span aria-hidden="true">Ã—</span> </button> <span ng-bind-html="message"></span> </div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/code-comment.tmpl.html", '<div class="comment-container {{category}}"> <ng-form name="commentForm"> <div ng-hide="editing" class="comment-viewer"> <div class="comment clearfix"> <div class="pill pill-{{category}}"><span translate="">{{ renameCategories(category) }}</span></div> <div class="inline-comment" marked="body"></div> </div> <div ng-if="editable"> <div class="row row-gap-small"></div> <button ng-click="startEdit()" type="button" class="btn btn-default">{{ \'Edit\' | translate }}</button> </div> </div> <div ng-show="editing" class="comment-editor"> <div class="category-inputs"> <label ng-repeat="categoryInfo in categories"> <input type="radio" required="" name="category" ng-model="modifiedComment.category" ng-value="categoryInfo.value"> &nbsp; {{ categoryInfo.label | translate }} </label> </div> <div ng-if="!!modifiedComment.category"> <div class="form-group"> <div class="row row-gap-small"></div> <div markdown-textarea="" form="commentForm"> <textarea rows="4" required="" class="form-control" type="text" name="comment" ng-model="modifiedComment.body" placeholder="Write something about this line of code...">{{ body }}</textarea> </div> </div> <div class="row row-buttons"> <div class="col-xs-12"> <button type="button" class="btn btn-secondary" busy-click="submitComment()" ng-disabled="commentForm.$invalid"> <span class="glyphicon glyphicon-ok"></span>&nbsp; <span translate="Save & Preview"></span> </button> <button ng-if="!isNewComment()" type="button" class="btn btn-default" ng-click="deleteComment()"> <span class="glyphicon glyphicon-trash"></span>&nbsp; {{ \'Delete\' | translate }} </button> <button type="button" class="btn btn-default" ng-click="cancelComment()">{{ \'Cancel\' | translate }}</button> </div> </div> </div> </div> </ng-form> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/code-review.tmpl.html", '<div ng-show="allowComments"> <input type="text" class="form-control" ng-model="filterPattern" placeholder=\'File filter (e.g. "readme.md", ".css", "src/lib/*.js")\'> <div class="row row-gap-small"></div> </div> <div class="code-section-item" ng-repeat="file in files" ng-show="isFileVisible(file)"> <div class="code-section-item-title" ng-click="setCurrentFileIndex($index)"> <small> <span ng-class="{\'glyphicon-triangle-right\': currentFileIndex !== $index, \'glyphicon-triangle-bottom\': currentFileIndex === $index}" class="glyphicon"> </span> </small> <strong>{{file.path}}</strong> <span ng-if="file.comments_count > 0" class="badge badge-info text-center"> {{ file.comments_count }} </span> </div> <div class="code-section-item-body" ng-if="currentFileIndex === $index"> <div mirror="" file="file" allow-comments="allowComments"> </div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/critique-editor.tmpl.html", '<h4 class="h-slim" translate="">Specification</h4> <p marked="rubricItem.passed_description"></p> <div ng-if="rubricItem.reviewer_tips"> <span class="tip-label pull-left"><small translate="">Tip</small></span> <div single-line-collapse="rubricItem.reviewer_tips" preview-length="100"></div> </div> <ng-form name="form"> <div class="row result-label" ng-if="modifiedCritique.resultLocked"> <div class="col-sm-1"> <div class="result-spacing"> <span class="result-icon {{modifiedCritique.result}} text-center"></span> </div> </div> <div class="col-sm-10">A previous reviewer passed the student on this rubric item.</div> <div class="col-sm-1 text-center"> <img src="/assets/images/icon-lock.svg"> </div> </div> <div class="row" ng-if="!modifiedCritique.resultLocked"> <div class="col-md-12"> <label> <input required="" type="radio" name="result-{{critique.id}}" value="failed" ng-model="modifiedCritique.result" ng-click="toggleExceededRequirements(false)">&nbsp;&nbsp; {{ \'failed\' | resultLabel | translate }} </label> </div> </div> <div class="row" ng-if="!modifiedCritique.resultLocked"> <div class="col-md-12"> <label> <input required="" type="radio" name="result-{{critique.id}}" value="passed" ng-model="modifiedCritique.result" ng-click="toggleExceededRequirements(false)">&nbsp;&nbsp; {{ \'passed\' | resultLabel | translate }} </label> </div> </div> <div class="row" ng-if="isExceedable()"> <div class="col-md-12"> <label> <input required="" type="radio" name="result-{{critique.id}}" value="exceeded" ng-model="modifiedCritique.result" ng-click="toggleExceededRequirements(false)">&nbsp;&nbsp; {{ \'exceeded\' | resultLabel | translate }} </label> <div class="requirements-panel"> <p marked="rubricItem.exceeded_description" class="caption caption-small"></p> </div> </div> </div> <div ng-if="!!critique.prev_observation"> <div class="tip-label pull-left"><small translate="">Previous Feedback</small></div> <div class="row row-gap-small"></div> <p marked="critique.prev_observation"></p> </div> <div ng-if="!!modifiedCritique.result"> <div markdown-textarea=""> <div class="row row-gap-small"></div> <textarea ng-required="isObservationRequired()" class="form-control" name="assessment" rows="4" placeholder="{{ getPlaceholderText() }}" ng-model="modifiedCritique.observation">\n      </textarea> </div> <div class="row row-buttons"> <div class="col-xs-12"> <button type="button" class="btn btn-secondary" busy-click="_submit()" ng-disabled="form.$invalid"> <span class="glyphicon glyphicon-ok"></span>&nbsp; <span translate="Save & Preview"></span> </button> <button type="button" class="btn btn-default" busy-click="_reset()"> <span class="glyphicon glyphicon-trash"></span>&nbsp; Reset </button> <button type="button" class="btn btn-default" ng-click="_cancel()"> {{ \'Cancel\' | translate }} </button> </div> </div> </div> </ng-form> <div class="row row-gap-small"></div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/critique-view.tmpl.html", '<div class="critique-view-header"> <div class="row result-label"> <div class="col-sm-1"> <div class="result-spacing"> <span ng-hide="isCareer" class="result-icon {{critique.result}} text-center"></span> </div> </div> <div class="col-xs-12 col-sm-10 critique-description" marked="rubricItem.passed_description"></div> <div class="col-sm-1 text-center" ng-if="editable && critiqueLocked()"> <img src="/assets/images/icon-lock.svg"> </div> </div> <div class="row row-gap-small" ng-if="editable && critiqueLocked()"> <div class="col-xs-12 col-md-10 col-md-offset-1"> <span class="tip-label pull-left"><small translate="">REVIEWER</small></span> <em>We were able to automatically grade this rubric point.</em> </div> </div> </div> <div ng-if="!!critique.observation" class="critique-view-body"> <div class="row"> <div class="col-xs-12 col-sm-10 col-sm-offset-1"> <div class="p-slim" marked="critique.observation"></div> </div> </div> </div> <div ng-if="editable && !critiqueLocked()"> <div class="row row-gap-small"> <div class="col col-xs-12 col-sm-offset-1 col-sm-10"> <button ng-click="editClicked()" class="btn btn-default"> <span class="glyphicon glyphicon-edit"></span>&nbsp; {{ \'Edit\' | translate }} </button> </div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/critiques-editor.tmpl.html", '<div ng-repeat="section in critiquesAccessor.getSections()"> <div section-critiques="" section="section" critiques="critiquesAccessor.getCritiques(section.id)" editable="editable" failed-required-placeholder="failedRequiredPlaceholder" passed-required-placeholder="passedRequiredPlaceholder" optional-placeholder="optionalPlaceholder" state="sectionCritiquesState[section.id]" is-career="isCareer"> </div> </div> <div class="row"> <div ng-if="!editable && submission.general_comment" class="col-xs-12 additional-reviewer-comment"> <strong translate="">Additional Reviewer Comments</strong> <p marked="submission.general_comment"></p> </div> </div> <div class="row"> <ng-form ng-if="!(state && state.audit)" name="general-comment-form"> <div ng-if="editable" class="col-xs-12 additional-reviewer-comment" id="generalComment"> <div ng-if="!general_comment_editing"> <strong translate="">Additional Reviewer Comments</strong> <p class="p-slim" marked="submission.general_comment"></p> <div> <div class="row row-gap-small"></div> <button ng-click="startEditing()" class="btn btn-default">{{ \'Edit\' | translate }}</button> </div> </div> <div ng-if="general_comment_editing"> <p translate="">Please provide the student with overall comments. This can also include general words of encouragement, a reply to comments in the student\'s notes, etc.</p> <div markdown-textarea=""> <textarea class="form-control" rows="4" ng-model="submission.general_comment"></textarea> </div> <div class="row row-buttons"> <div class="col-xs-12"> <button class="btn btn-secondary" busy-click="saveGeneralComment()" ng-disabled="!submission.general_comment"> <span class="glyphicon glyphicon-ok"></span>&nbsp; <span translate="Save & Preview"></span> </button> <button class="btn btn-default" busy-click="resetGeneralComment()" ng-disabled="!submission.general_comment"> <span class="glyphicon glyphicon-trash"></span>&nbsp;Reset </button> </div> </div> </div> </div> </ng-form> </div> <div class="row row-gap-small"></div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/loading-container.tmpl.html", '<div ng-show="loading" class="row"> <div class="col-sm-6 col-sm-offset-3 text-center"> <div class="row row-gap-huge"></div> <img src="/assets/images/loading.gif"> <div class="row row-gap-huge"></div> </div> </div> <div ng-show="!loading"> <div ng-transclude=""></div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/markdown-textarea.tmpl.html", '<div ngf-drop="" ng-model="files" ngf-multiple="true" ngf-allow-dir="false" ngf-max-size="maxSize" ngf-accept="accept" accept="{{ accept }}" ngf-drag-over-class="{accept:\'dragover\', reject:\'dragover-reject\', delay:100}" class="drop-box"> <div ng-transclude=""></div> <p class="caption"> {{ \'Attach images (.png, .gif, .jpg) by dragging and dropping or selecting them (10 MB limit).\' | translate }} <a href="" ngf-select="" ngf-accept="accept" accept="{{ accept }}" ng-model="files" ngf-multiple="true"> {{ \'Browse files.\' | translate }} </a> <br> <a href="https://guides.github.com/features/mastering-markdown/" target="_blank">Markdown supported.</a> </p> <p ng-if="errorMessage" class="pull-left caption error"> {{ errorMessage }} </p> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/mirror.tmpl.html", '<div ng-show="isLoading" class="loading"> </div> <div class="code-mirror-holder" ui-codemirror="{ onLoad: codeMirrorLoaded }" ui-codemirror-opts="generateEditorOptions(file)" ng-hide="isLoading"> </div>')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/reviews-list.tmpl.html", '<h2 class="review-list-name current-review-name h-slim"> <span ng-if="thisReview.status !== \'canceled\'"> {{ \'Review\' | translate }} #{{nonCanceledReviewIndexHash[thisReview.id]}} </span> <span ng-if="thisReview.status === \'canceled\'"> {{ \'Canceled Submission\' | translate }} </span> <span> ({{ \'this review\' | translate }})</span> </h2> <small class="text-muted" ng-if="thisReview.completed_at"> <span ng-if="thisReview.status !== \'canceled\'" translate="">Reviewed</span> <span ng-if="thisReview.status === \'canceled\'" translate="">Student canceled</span> <span> <span am-time-ago="thisReview.completed_at"></span></span> </small> <div ng-if="!thisReview.completed_at"> <small class="text-muted" translate="">Review in progress</small> </div> <div class="text-uppercase submission-notes-header" translate=""> student notes </div> <div class="submission-notes" marked="thisReview.notes || \'_None provided_\'"></div> <hr ng-if="filteredReviews.length > 1"> <div ng-if="filteredReviews.length > 1" ng-repeat="review in filteredReviews"> <div class="row row-gap-small"> <div class="col-xs-7"> <span ng-if="review.status !== \'canceled\'"> <span ng-if="!(thisReview && thisReview.id === review.id)"> <a class="review-list-name" ui-sref="reviews-show({submissionId: review.id, audit: null})"> {{ \'Review\' | translate }} #{{nonCanceledReviewIndexHash[review.id]}} <span ng-if="review.previous_submission_id">({{ \'revision of prior review\' | translate}})</span> </a> <span class="reason-not-reviewing" ng-if="performedReview(review.id)"> {{ \'You reviewed this submission\' | translate }} </span> <span class="review-voting" ng-if="!performedReview(review.id)"> <button ng-class="[\'glyphicon glyphicon-thumbs-up upvote\', {\'upvoted\': votes[review.id].value == 1}]" ng-click="showVoteModal(review.id, 1)" title="Upvote previous submission. Give feedback by letting us know that this was a good review." aria-label="Upvote previous submission. Give feedback by letting us know that this was a good review."></button> <button ng-class="[\'glyphicon glyphicon-thumbs-down downvote\', {\'downvoted\': votes[review.id].value == -1}]" ng-click="showVoteModal(review.id, -1)" title="Downvote previous submission. Give feedback by letting us know that this was a bad review." aria-label="Downvote previous submission. Give feedback by letting us know that this was a bad review."></button> </span> </span> <span class="review-list-name" ng-if="!isCareer && thisReview && thisReview.id === review.id"> {{ \'This review\' | translate }} <span ng-if="review.previous_submission_id">({{ \'revision of prior review\' | translate }})</span> </span> </span> <span class="review-list-name" ng-if="review.status === \'canceled\'"> {{ \'Canceled Submission\' | translate }} </span> </div> </div> <div class="row"> <div ng-if="review.completed_at && !(isCareer && thisReview.id === review.id)" class="col-xs-12 text-muted"> <small> <span ng-if="review.status !== \'canceled\'" translate="">Reviewed</span> <span ng-if="review.status === \'canceled\'" translate="">Student canceled</span> <span> <span am-time-ago="review.completed_at"></span></span> </small> </div> <div ng-if="!review.completed_at" class="col-xs-12 text-muted"> <small translate="">Review in progress</small> </div> </div> </div> <div ng-if="errorMessage" scroll-if="errorMessage" class="row row-gap-medium"> <div class="alert alert-danger" ng-bind-html="errorMessage"> </div> </div> <div class="row row-gap-large"></div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/rubric-items-list.tmpl.html", '<div ng-repeat="section in rubricItemsAccessor.getSections()"> <div class="panel"> <div class="col-xs-12 bg-gray"> <div class="row row-gap-medium"></div> <h2 class="h-slim-top expandable expandable-pull-right" ng-class="{expanded: isExpanded(section.id)}" ng-click="toggleExpansion(section.id)"> {{ section.name }} </h2> <div ng-if="isExpanded(section.id)"> <div ng-repeat="rubricItem in rubricItemsAccessor.getRubricItems(section.id)"> <div class="col-xs-12 bg-white"> <h4 translate="">Specification</h4> <p marked="rubricItem.passed_description"></p> </div> <div class="row row-gap-medium"></div> </div> </div> <div class="row row-gap-medium"></div> </div> </div> <div ng-if="!$last" class="row row-gap-large"></div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/section-critiques.tmpl.html", '<div> <div class="row row-gap-small"></div> <h3 class="section-name"> {{ section.name }} </h3> <div> <div ng-repeat="critique in critiques"> <div row="" row-gap-small="" col-xs-12="" bg-white="" scroll-if="isCurrentEditingCritique(critique.id)"> <div class="critique-container" critique-editor="" critique="critique" success="setEditingCritique(critique.id, !critique.result)" cancel="setEditingCritique(critique.id, !critique.result)" failed-required-placeholder="failedRequiredPlaceholder" passed-required-placeholder="passedRequiredPlaceholder" optional-placeholder="optionalPlaceholder" ng-if="isEditingCritique(critique.id)"> </div> <div class="critique-container" critique-view="" critique="critique" editable="editable" is-career="isCareer" edit-clicked="setEditingCritique(critique.id, true)" ng-if="!isEditingCritique(critique.id)"> </div> </div> </div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/directives/single-line-collapse.tmpl.html", '<div ng-if="singleLineCollapse" class="one-line-collapse"> <div uib-collapse="collapse" class="collapse"> <div marked="text"></div> </div> <a ng-if="isToggleShown && collapsed" class="toggle" href="" ng-click="toggleCollapse()">{{ \'show\' | translate }}</a><p></p> <a ng-if="isToggleShown && !collapsed" class="toggle" href="" ng-click="toggleCollapse()">{{ \'hide\' | translate }}</a><p></p> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/templates/404.tmpl.html", '<div class="row row-gap-huge"> <div class="col-sm-6 col-sm-offset-3 text-center"> <div class="info-pic"><img src="/assets/images/404.png" alt="What are you doing here, Doctor?" title="What are you doing here, Doctor?"></div> <h1 translate="">We\'re very sorry...</h1> <p translate="">The page you were looking for slipped through a crack and can\'t be found!</p> </div> </div> <div class="row row-gap-huge"></div>')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/templates/api-token-modal.tmpl.html", '<div> <button type="button" class="close hanging-close" aria-label="close" ng-click="$dismiss()"> </button> <div class="modal-header text-center"> <p translate="">API Access</p> </div> <div ng-if="!ctrl.isEditing()"> <div class="modal-body"> <div class="row"> <div class="col-xs-10 col-xs-offset-1"> <h3 translate="">Your Token</h3> <textarea readonly="true" wrap="soft" class="form-control" rows="3">{{apiToken}}</textarea> </div> </div> </div> <div class="modal-footer"> <button class="btn btn-primary" ng-disabled="$invalid" type="submit" ng-click="$dismiss()">{{ \'Close\' | translate }}</button> </div> </div> </div>')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/templates/error.tmpl.html", '<div class="row row-gap-huge"> <div class="col-sm-6 col-sm-offset-3 text-center"> <div class="info-pic"> <img src="/assets/images/oops.png" alt="<vadervoice>NOOOOOOOOOoooooooo!</vadervoice>" title="<vadervoice>NOOOOOOOOOoooooooo!</vadervoice>"> </div> <h1 translate="">Oops, something went wrong...</h1> <p translate="">An error occurred while processing your last request.</p> <p> {{ \'Return to\' | translate }} <a href="http://udacity.com/" translate="">Udacity homepage</a>.</p> </div> </div> <div class="row row-gap-huge"> </div>')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/templates/footer.tmpl.html", '<footer id="footer" ng-controller="FooterCtrl as ctrl"> <div class="container"> <ul class="nav nav-pills"> <li ng-if="currentUser && currentUser.role !== \'student\'"><a href="{{handbookUrl}}" translate="">Reviewer FAQ</a></li> <li ng-if="currentUser && currentUser.role !== \'student\'"><a href="{{agreementUrl}}" target="blank" translate="">Reviewer Agreement</a></li> </ul> </div> </footer> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/templates/forbidden.tmpl.html", '<div class="row row-gap-huge"> <div class="col-sm-6 col-sm-offset-3 text-center"> <div class="info-pic"> <img src="/assets/images/oops.png" alt="<vadervoice>NOOOOOOOOOoooooooo!</vadervoice>" title="<vadervoice>NOOOOOOOOOoooooooo!</vadervoice>"> </div> <h1 translate="">Unauthorized</h1> <p translate="">You don\'t have permission to perform your last request.</p> </div> </div> <div class="row row-gap-huge"></div>')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/templates/header.tmpl.html", '<header class="navbar site-nav navbar-inverse navbar-static-top" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse"> <span class="sr-only" translate="">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="logo navbar-brand" href="https://udacity.com" id="header-logo"> <img alt="Udacity Logo" src="//s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg"> </a> </div> <nav class="navbar-collapse collapse text-center-xs" id="navbar-collapse" role="navigation"> <ul class="nav navbar-nav navbar-right"> <li ng-if="isStaff" ng-controller="ApiTokenCtrl as ctrl"> <a href="" busy-click="ctrl.showApiTokenModal()">{{ \'API Access\' | translate }}</a> </li> <li ng-if="isGrader"> <a ui-sref="submissions.dashboard" href="" translate="">Dashboard</a> </li> <li> <a data-ng-click="main.logout()" href="" translate="">Logout</a> </li> </ul> <ul class="nav navbar-nav navbar-right ng-cloak"> <li class="dropdown"> <ul class="dropdown-menu"> <a data-ng-click="main.logout()" href="" translate="">Logout</a> </ul> </li> </ul> </nav> </div> </header> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("common/templates/loading.tmpl.html", '<div class="row row-gap-huge"> <div class="text-center"> <div class="loading"></div> </div> </div> <div class="row row-gap-huge"> </div>')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/directives/audit-tab.tmpl.html", '<div class="clearfix" ng-if="auditCritiquesAccessor"> <div ng-if="audit.result"> <h2 class="h-slim-top {{audit.result}}" ng-class="{\'result-label\': isOnboardingAudit}"> {{ audit.result | resultLabel:{pluralize: true} }} </h2> <div ng-if="audit.result === \'failed\'"> <p ng-if="isOnboardingAudit"> {{ \'Your review does not meet all of our quality specifications. Read through the Coachâ€™s comments and then continue to the\' | translate }} <a ui-sref="submissions.dashboard({tab: \'onboarding\'})" href="">{{ \'dashboard\' | translate }}</a> {{ \'for your next instructions. We may limit the number of attempts you have to successfully complete this review.\' | translate }} </p> <p ng-if="!isOnboardingAudit"> {{ \'Your review does not meet all of our quality specifications. The only action required is to apply the auditorâ€™s feedback to future reviews. Reminder: You may not be compensated for this review.\' | translate }} </p> </div> <div ng-if="audit.result === \'passed\'"> <p ng-if="isOnboardingAudit"> {{ \'Great work! Your review meets all of our quality specifications. You may read through this audit and then continue to the\' | translate }} <a ui-sref="submissions.dashboard({tab: \'onboarding\'})" href="">{{ \'dashboard\' | translate }}</a> {{ \'for your next instructions.\' | translate }} </p> <p ng-if="!isOnboardingAudit"> {{ \'Your review meets all of our quality specifications. Keep up the good work!\' | translate }} </p> </div> </div> <div critiques-editor="" critiques-accessor="auditCritiquesAccessor" editable="auditEditable" failed-required-placeholder="\'Explain why the reviewer did not meet the specification and, if applicable, provide guidance for next review.\'" passed-required-placeholder="\'Explain what the reviewer needs to do to exceed the specification.\'" optional-placeholder="\'Give the reviewer some positive feedback.\'" commenter-label="\'Auditor\'" state="auditCritiquesState"> </div> <div class="pull-right" ng-if="auditEditable"> <button busy-click="reviseReview()" class="btn btn-default">{{ \'Create revised review\' | translate }}</button> <button busy-click="confirmSubmitAudit()" ng-disabled="!isComplete()" class="submit-audit btn btn-primary"> <i class="glyphicon glyphicon-check"></i> {{ \'Submit Audit\' | translate }} </button> <div class="row row-gap-medium"></div> </div> <div ng-if="!isAuditor"> <div class="row"></div> <hr class="slim"> <div class="row row-gap-medium"></div> <p class="slim"> <img src="/assets/images/support-icon.svg" class="img-initial icon"> {{ \'Have a question about your audit? Email us at\' | translate }} <a href="mailto:review-support@udacity.com">review-support@udacity.com</a>. </p> <div class="row row-gap-medium"></div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/directives/create-submission-form.tmpl.html", '<div ng-if="ctrl.isLoading" class="text-center"> <div class="loading"></div> </div> <div ng-if="!ctrl.isLoading"> <div ng-if="ctrl.githubRequired && !ctrl.hasValidGithubToken"> <div github-auth="" redirect-path="#!{{ ctrl.githubAuthRedirectPath }}"> </div> </div> <div ng-if="!ctrl.githubRequired || ctrl.hasValidGithubToken"> <form> <div ng-transclude=""></div> <div ng-if="ctrl.optionalRubricItems && ctrl.optionalRubricItems.length > 0" id="optional-rubric-items"> <div class="form-group text-left"> <h3 translate="">Did you attempt any of the optional features?</h3> <div class="radio"> <label> <input type="radio" ng-model="ctrl.optionalRubricItemsAttempted" value="yes"> Yes </label> </div> <div class="radio"> <label> <input type="radio" ng-model="ctrl.optionalRubricItemsAttempted" value="no"> No </label> </div> </div> <div class="form-group text-left" ng-show="ctrl.optionalRubricItemsAttempted === \'yes\'"> <div class="row row-gap-small"></div> <h3 translate="">Select any of the optional features that you attempted</h3> <div rubric-items-selector="" rubric-items="ctrl.optionalRubricItems"> </div> </div> </div> <div class="form-group"> <div ng-if="isCareer" class="text-left"> <h3 translate=""> Desired Role and Industry (Required) </h3> <p class="text-left" translate="DESIRED_ROLE_TEXT"></p> <textarea class="form-control" ng-model="ctrl.intendedCareer" rows="2"></textarea> </div> <div class="notes-to-reviewer"> <h3 ng-show="!isCareer" translate="">Submission Details</h3> <p ng-show="!isCareer" class="text-left" translate=""> Are there any areas you would like your reviewer to pay particular attention to? </p> <h3 ng-show="isCareer" translate="">Additional Details (Required)</h3> <p ng-show="isCareer" class="text-left" translate="ADDITIONAL_DETAILS_TEXT"></p> <textarea class="form-control" ng-model="ctrl.studentNotes" rows="4"></textarea> </div> <div ng-if="canaryEnabled" class="unit-test-confirmation"> <h3 translate="">Did you run unit tests on your project?</h3> <ul class="radio text-left"> <li class="radio-list"> <input name="tests" id="unit-tests-yes" ng-change="ctrl.transitionTestWarning(\'complete\')" ng-model="ctrl.unitTestAnswer" ng-value="\'yes\'" class="pull-left" type="radio"> <label for="unit-tests-yes">{{ \'Yes, successfully\' | translate }}</label> </li> <li class="radio-list"> <input name="tests" id="unit-tests-yes-but" ng-change="ctrl.transitionTestWarning(\'warning\')" ng-model="ctrl.unitTestAnswer" ng-value="\'yesBut\'" class="pull-left" type="radio"> <label for="unit-tests-yes-but">{{ \'Yes, but they did not pass\' | translate }}</label> </li> <li class="radio-list"> <input name="tests" id="unit-tests-no" ng-change="ctrl.transitionTestWarning(\'error\')" ng-model="ctrl.unitTestAnswer" ng-value="\'no\'" class="pull-left" type="radio"> <label for="unit-tests-no">{{ \'No\' | translate }}</label> </li> </ul> <div ng-show="ctrl.unitTestAnswer === \'yesBut\'" ng-class="ctrl.warningClass"> <span translate="">Youâ€™re almost there! You are required to pass unit tests before submitting your project. Need help?</span> <span translate="">Try on</span> <a ng-href="{{canaryMetadata.canary_slack_url}}" target="_blank">Slack</a> <span translate="">or ask in the</span> <a ng-href="{{canaryMetadata.canary_forums_url}}" target="_blank">Forums</a>. </div> <div ng-show="ctrl.unitTestAnswer === \'no\'" ng-class="ctrl.errorClass"> <span translate="">You are required to pass unit tests before submitting your project. Need help?</span> <span translate="">Reach out on</span> <a ng-href="{{canaryMetadata.canary_slack_url}}" target="_blank">Slack</a> <span translate="">or ask in the</span> <a ng-href="{{canaryMetadata.canary_forums_url}}" target="_blank">Forums</a>. </div> </div> <div class="row row-gap-small"></div> <div ng-if="!isCareer" class="text-left"> <h3 translate="">Udacity Honor Code</h3> <p> <input type="checkbox" id="my-work" ng-model="ctrl.myWorkTermsAccepted"> <label for="my-work" class="checkbox-description"> <span translate="HONOR_CODE_MY_WORK"></span> </label> </p> <p> <input type="checkbox" id="attribution" ng-model="ctrl.attributionTermsAccepted"> <label for="attribution" class="checkbox-description"> <span translate="HONOR_CODE_ATTRIBUTION"></span> </label> </p> <p> <input type="checkbox" id="plagiarism" ng-model="ctrl.plagiarismTermsAccepted"> <label for="plagiarism" class="checkbox-description"> <span translate="HONOR_CODE_PLAGIARISM"></span> </label> </p> </div> </div> <div ng-if="isCareer" class="text-left"> <h3 translate="">Udacity Honor Code</h3> <p> <input type="checkbox" id="my-info" ng-model="ctrl.visibilityTermsAccepted"> <label for="my-info" class="checkbox-description"> <span translate="">I understand that my submitted materials will be visible to the reviewer, including any personal information I choose to include.</span> </label> </p> <p> <input type="checkbox" id="plagiarism" ng-model="ctrl.plagiarismTermsAccepted"> <label for="plagiarism" class="checkbox-description"> <span translate="HONOR_CODE_PLAGIARISM"></span> </label> </p> </div> </form></div> <div class="row row-gap-medium"> <div class="col-xs-12"> <button type="submit" ng-disabled="!ctrl.isFormComplete(transclusionValid) ? \'disabled\' : null" class="btn btn-primary btn-min-width-sm submit-file" busy-click="ctrl.submit()"> {{ \'Submit\' | translate }} </button>  <div ng-show="ctrl.errorMessage" scroll-if="ctrl.errorMessage" class="row row-gap-medium"> <div class="alert alert-danger" ng-bind-html="ctrl.errorMessage | translate"> </div> </div> </div> </div> <div class="row row-gap-medium"></div> </div> ');
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/directives/github-auth.tmpl.html", '<div class="row text-center"> <p class="text-center" translate=""> Connect your GitHub account to your Udacity account to enable us to access your public repositories. </p> <a href="{{ githubAuthUrl }}" class="btn btn-lg btn-primary"> <i class="glyphicon glyphicon-link"></i> {{ \'Connect with GitHub\' | translate }} </a> </div>')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/directives/rubric-items-selector.tmpl.html", '<div class="text-left rubric-items-selector"> <div ng-repeat="rubricItem in rubricItems"> <label class="full-width"> <input type="checkbox" name="rubricItem" ng-model="rubricItem.isSelected"> <div class="checkbox-description"> <div marked="rubricItem.passed_description"></div> </div> </label> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/directives/social-share.tmpl.html", '<div class="share-table hidden-xs"> <div class="share-prompt"> {{prompt}} </div> <div class="pull-right"> <a ng-click="showTwitterPopup()" class="btn btn-xs"> <img src="/assets/images/twitter.svg"> </a> <a ng-click="showFacebookPopup()" class="btn btn-xs"> <img src="/assets/images/facebook.svg"> </a> </div> </div> <div class="btn-block share-table visible-xs"> {{ \'Share your accomplishment!\' | translate }}&nbsp;<a href="" ng-click="showTwitterPopup()"><img src="/assets/images/twitter.svg"></a>&nbsp;<a href="" ng-click="showFacebookPopup()"><img src="/assets/images/facebook.svg"></a> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/confirm-audit-modal.tmpl.html", '<div> <button type="button" class="close hanging-close" aria-label="close" ng-click="$dismiss()"> </button> <div class="modal-header"> <h2 class="h-slim text-center">Confirm Audit Submission</h2> </div> <div class="modal-body">   <p class="text-center"> Are you sure you\'d like to submit this audit? </p> </div> <div class="modal-footer"> <div class="text-center full-width"> <button class="btn btn-danger" type="submit" ng-click="$close()"> Confirm Audit </button> </div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/in-review.tmpl.html", '<div class="row row-gap-huge" ng-controller="InReviewCtrl as ctrl"> <div class="text-center col-sm-6 col-sm-offset-3"> <img class="page-icon-lg" ng-src="/assets/images/student-processing.svg" alt="yellow checkmark icon"> <div> <h1 translate="">We\'re processing your submission</h1> <p> {{ \'You can expect to receive your project feedback from a Udacity Reviewer in \' + ctrl.estimatedSLA | translate }}. </p> <p> {{ \'Forgot a file or uploaded the wrong zip? There\\\'s still time to cancel your submission!\' | translate }} <a href="https://udacity.zendesk.com/hc/en-us/articles/210743526-How-do-I-cancel-a-project-submission-">{{ \'Learn more\' | translate }}</a>. </p> </div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/instructions.tmpl.html", '<div ng-controller="InstructionsCtrl as ctrl" class="row row-gap-large"> <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2"> <h1 id="project-name" class="text-center"> {{rubric.project.name}} <h2 id="project-instructions-headline" translate=""> Instructions </h2> <div class="row"> <div marked="rubric.description" opts="{sanitize: false}" class="col-xs-12"></div> </div> <div class="row row-gap-large"></div> </h1></div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/project-details-modal.tmpl.html", '<div> <button type="button" class="close hanging-close" aria-label="close" ng-click="$dismiss()"> </button> <div class="modal-header"> <h4>{{project.nanodegree_title}}</h4> </div> <div class="modal-body"> <h3 class="h-slim">{{ project.name }}</h3> <div class="row row-gap-small"></div> <span marked="project.required_skills || \'_No Requirements_\'"></span> <div class="row row-gap-small"></div> <span class="caption"><small>{{ project.price | currency : \'$\' : 2 }}</small></span> </div> <div class="modal-footer"> <div class="pull-right"> <button class="btn btn-primary" ng-click="$dismiss()"> {{ \'Close\' | translate }} </button> </div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/resubmission-video-modal.tmpl.html", '<div class="modal-body"> <div class="row"> <div class="col-xs-12"> <iframe width="640" height="360" src="https://s3.cn-north-1.amazonaws.com.cn/u-vid/DklT8Y4GJYA.mp4" frameborder="0" allowfullscreen=""></iframe> </div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/reviewer-bio-modal.tmpl.html", '<div> <button type="button" class="close hanging-close" aria-label="close" ng-click="$dismiss()"> </button> <div class="modal-header"> <div class="reviewer-bio vertical"> <p class="pink">Reviewer profile</p> <div> <img class="reviewer-bio-pic" ng-src="{{ mentor.avatar_url}}"> <p class="reviewer-name">{{ mentor.name }}</p> </div> </div> </div> </div> <hr class="break"> <div class="modal-body"> <p class="about-me"> About Me </p> <p class="bio-text"> {{ mentor.bio }} </p> </div> <div class="modal-footer"> <div class="text-center full-width"> <button class="btn btn-primary" ng-click="$close()"> Close </button> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/rubric.tmpl.html", '<div ng-controller="RubricCtrl as ctrl" class="row"> <div id="proj-spec-div" class="col-xs-offset-1 col-xs-10"> <h2 id="project-spec-headline" translate=""> Project Specification </h2> <h3 id="project-name" ng-bind-html="localize(ctrl.rubric.project, \'name\', markup=true)"> </h3>  <div ng-repeat="section in ctrl.rubric.sections"> <span class="rubric-section" ng-bind-html="localize(section, \'name\', markup=true)"> </span> <table class="table table-bordered section-table"> <thead> <tr> <th class="rubric-category criteria col-xs-3" ng-if="!ctrl.hideCriteria"> <span translate="">Criteria</span> </th> <th class="rubric-category meets-specs" ng-class="ctrl.reviewerTips ? col-xs-7 : col-xs-4"> <span translate="">Meets Specifications</span> </th> <th class="rubric-category reviewer-tips col-xs-3" ng-if="ctrl.reviewerTips"> <span translate="">Reviewer Tips</span> </th> </tr> </thead> <tbody>  <tr ng-repeat="rubricItem in section.rubric_items"> <td class="rubric-item col-xs-3" ng-if="!ctrl.hideCriteria" ng-bind-html="localize(rubricItem, \'criteria\', markup=true)"> </td> <td class="rubric-item" ng-class="ctrl.reviewerTips ? col-xs-7 : col-xs-4" ng-bind-html="localize(rubricItem, \'passed_description\', markup=true)"> </td> <td class="rubric-item col-xs-3" ng-if="ctrl.reviewerTips" ng-bind-html="localize(rubricItem, \'reviewer_tips\', markup=true)"> </td> </tr> </tbody> </table> </div> <div id="stand-out" ng-if="ctrl.rubric.stand_out" class="col-xs-offset-1 col-xs-10"> <h3 id="stand-out-headline" class="text-center" translate="">Suggestions to Make Your Project Stand Out!</h3> <div id="stand-out-text" ng-bind-html="localize(ctrl.rubric, \'stand_out\', markup=true)"> </div> </div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/share-review-header.tmpl.html", '<link rel="stylesheet" href="https://www.udacity.com/media/css/standalone/udacity/homepage/homepage.min.css?c6e0c1541f8974c9369c70a045d4c9b4" ,="" type="text/css">  <style>\n  h2 { font-size: 22px; }\n</style> <header class="navbar site-nav navbar-inverse navbar-static-top" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse"> <span class="sr-only" translate="">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a itemprop="brand" itemscope="" itemtype="http://schema.org/Brand" class="logo navbar-brand" href="/me#!/" id="header-logo"> <meta itemprop="logo" content="//s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg"> <img alt="Udacity Logo" src="//s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg"> </a> </div> <nav class="navbar-collapse collapse text-center-xs" id="navbar-collapse" role="navigation"> <ul class="nav navbar-nav navbar-right"> <li> <a href="" onclick="window.location.href=\'https://www.udacity.com/account/auth#!/signup?next=\'+encodeURIComponent(window.location.href)" translate="">Sign Up</a> </li> </ul> <ul class="nav navbar-nav navbar-right"> <li> <a id="sign-in" href="" onclick="window.location.href=\'https://www.udacity.com/account/auth#!/signin?next=\'+encodeURIComponent(window.location.href)" translate="">Sign In</a> </li> </ul> <ul class="nav navbar-nav navbar-right"> <li> <a id="catalog" class="dropdown-toggle" href="https://www.udacity.com/courses/all" translate="">Catalog</a> </li> </ul> <ul class="nav navbar-nav navbar-right"> <li> <a href="https://www.udacity.com/nanodegree" translate="">Nanodegree</a> </li> </ul> </nav> </div> </header> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/share-review.tmpl.html", '<div class="share-review"> <div class="review-header"> <div class="project-label text-uppercase text-center" translate="">Project</div> <div class="project-name text-center">{{project.name}}</div> <div class="nanodegree-link text-center" ng-if="project.nanodegree_title"> {{ \'A part of the\' | translate }} {{project.nanodegree_title}} Program </div> </div> <div class="row row-gap-medium"></div> <div class="review-container"> <ul class="nav nav-tabs nav-justified"> <li class="active"> <a href="" translate="">Project Review</a> </li> <li> <a href=""> <img src="/assets/images/icon-lock.svg" uib-popover="Udacity Code Reviewers review projects line-by-line and provide helpful comments." popover-placement="top" popover-class="share-review-locked" popover-trigger="mouseenter">&nbsp;{{ \'Code Review\' | translate }}&nbsp;<span ng-if="submission.comment_count" class="badge badge-info text-center">{{submission.comment_count}}</span> </a> </li> <li ng-if="submission.has_annotations"> <a href=""> <img src="/assets/images/icon-lock.svg" uib-popover="Udacity Code Reviewers review projects line-by-line and provide helpful comments." popover-placement="top" popover-class="share-review-locked" popover-trigger="mouseenter">&nbsp;{{ \'Annotations\' | translate }}&nbsp;<span class="badge badge-info text-center">1</span> </a> </li> <li> <a href=""> <img src="/assets/images/icon-lock.svg" uib-popover="Udacity Code Reviewers review projects line-by-line and provide helpful comments." popover-placement="top" popover-class="share-review-locked" popover-trigger="mouseenter">&nbsp;{{ \'Notes\' | translate }}</a> </li> </ul> <div class="row row-gap-large"> <div class="col-xs-10 col-xs-offset-1"> <div ng-if="submission.result"> <h3 class="result-label h-slim-top"> {{ submission.result | resultLabel:{pluralize: true} }} </h3> <div ng-if="doesNotMeetCount > 0"> <h4 class="result-label"><span class="{{submission.result}}"></span>{{ doesNotMeetCount | pluralize: \'specification requires\':\'specifications require\' | translate }} {{ \'revision\' | translate }}</h4> </div> </div> <div ng-if="submission.general_comment" class="additional-reviewer-comment"> <p marked="submission.general_comment"></p> </div> <div ng-if="critiquesAccessor" critiques-editor="" critiques-accessor="critiquesAccessor" editable="false"> </div> </div> <div> </div> </div> </div></div>')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/show-review.tmpl.html", '<div class="row"> <div class="col-xs-12 col-lg-10 col-lg-offset-1"> <h4 ng-if="submission.previous_submission_id" translate="">REVISED REVIEW</h4> <div class="review-header"> <div class="review-header__links"> <div> <a href="" ng-click="goToClassroomPath()" class="course-link"> <span class="arrow"></span>&nbsp; <span translate=""> Return to "{{ currentProject.nanodegree_title || currentProject.name }}" in the classroom </span> </a> </div> <div ng-show="isStudentHubEligible()"> <a href="" ng-click="goToStudentHubLink()" class="course-link btn btn-secondary btn-sm" target="_blank"> <img ng-src="/assets/images/icon-student-hub.svg" alt="Student Hub chat icon" height="24" width="24" class="student-hub-icon"> <span translate="">Discuss on Student Hub</span>&nbsp; <span class="arrow right white"></span> </a> </div> </div> <p class="project-name-career-service">{{currentProject.name}}</p> </div> <div class="row row-gap-medium"></div> <div class="review-container"> <ul class="nav nav-tabs nav-justified" ng-show="isUngradeable()"> <li ng-class="{\'active\': isCurrentTab(\'feedback\')}"> <a href="" ng-click="showTab(\'feedback\')">{{ \'Review\' | translate }}</a> </li> <li ng-class="{\'active\': isCurrentTab(\'history\')}"> <a href="" ng-click="showTab(\'history\')">{{ \'History\' | translate }}</a> </li> </ul> <ul class="nav nav-tabs nav-justified" ng-hide="isUngradeable()"> <li ng-if="hasFeedback" ng-class="{\'active\': isCurrentTab(\'feedback\')}"> <a href="" ng-click="showTab(\'feedback\')">{{ \'Review\' | translate }}</a> </li> <li ng-if="showCode" ng-class="{\'active\': isCurrentTab(\'code\')}"> <a href="" ng-click="showTab(\'code\')"> {{ \'Code Review\' | translate }}&nbsp; <span ng-if="commentsCount > 0" class="badge badge-info text-center"> {{ commentsCount }} </span> </a> </li> <li ng-if="annotation_link" ng-class="{\'active\': isCurrentTab(\'annotation\')}"> <a href="" ng-click="showTab(\'annotation\')"> {{ \'Annotations\' | translate }}&nbsp; <span class="badge badge-info text-center">1</span> </a> </li> <li ng-class="{\'active\': isCurrentTab(\'history\')}"> <a href="" ng-click="showTab(\'history\')">{{ \'History\' | translate }}</a> </li> <li ng-if="userCanCreateAudits() && !auditTabState.visible"> <a href="" busy-click="assignAudit()">+ {{ \'Audit this Review\' | translate }}</a> </li> <li ng-if="auditTabState.visible" ng-class="{\'active\': isCurrentTab(\'audit\')}"> <a href="" ng-click="showTab(\'audit\')">{{ \'Audit\' | translate }}</a> </li> </ul> <div class="row review-tab-body"> <div class="col-sm-10 col-sm-offset-1"> <div ng-show="isUngradeable()"> <div class="row row-gap-medium"></div> <section ng-show="isCurrentTab(\'feedback\')"> <div class="ungradeable-tab"> <h3 class="result-label" translate="">Unable to review</h3> <div ng-hide="submission.ungradeable_tag === \'plagiarism\'"> <p class="ungradeable-info" translate=""> Your project could not be reviewed. Please resubmit after you address the issue noted below by the reviewer. </p> <p class="result-reason" marked="submission.result_reason"></p> </div> <div ng-show="submission.ungradeable_tag === \'plagiarism\'"> <p class="ungradeable-info"> <span translate=""> Key parts of your submission were the same as another student\'s submission or an online source.</span> <span>Please resubmit after you address the issue noted below by the reviewer.</span> </p> <p class="ungradeable-info" ng-show="submission.plagiarism_source_url"> </p><h4 translate="" style="display: inline;">Potential Source URL:</h4> <a href="{{submission.plagiarism_source_url}}">{{ submission.plagiarism_source_url }}</a> <p></p> <p class="result-reason" marked="submission.result_reason"></p> </div> <div class="row row-gap-small"></div> <div ng-if="isResubmittable()" class="row row-gap-small"> <div class="col-xs-12 text-center"> <a ui-sref="rubrics.start({rubricId: currentRubric.id})" class="btn btn-primary visible-xs"> <i class="glyphicon glyphicon-check"></i> {{ \'Resubmit\' | translate }} </a> <button ng-if="isResubmittable()" ui-sref="rubrics.start({rubricId: currentRubric.id})" class="btn btn-primary hidden-xs"> <i class="glyphicon glyphicon-check"></i> {{ \'Resubmit Project\' | translate }} </button> </div> </div> <div ng-if="submission.archive_url" class="row row-gap-small"> <div class="col-xs-12 text-center wide-and-bold"> <a href="{{ submission.archive_url }}" download=""><img src="/assets/images/download-icon.svg" class="img-initial icon-medium">{{ \'Download project files\' | translate }}</a> </div> </div> <div ng-if="submission.url" class="row row-gap-small"> <div class="col-xs-12 text-center"> <a class="wide-and-bold" target="_blank" href="{{ submission.url }}"> <i class="glyphicon glyphicon-new-window"></i>&nbsp; {{ \'Project Link\' | translate }} </a> </div> </div> <div class="row row-gap-small">&nbsp;</div> </div> </section> <section ng-show="isCurrentTab(\'history\')"> <div reviews-list="" ng-if="pastReviews !== undefined" reviews="pastReviews" this-review="submission"></div> </section> </div> <div ng-hide="isUngradeable()"> <div class="row row-gap-medium"></div> <section ng-show="isCurrentTab(\'history\')"> <div reviews-list="" ng-if="pastReviews !== undefined" reviews="pastReviews" this-review="submission" is-career="currentProject.is_career"></div> </section> <section class="code-section" ng-show="isCurrentTab(\'code\')"> <div code-review="" ng-if="files && currentRubric" files="files" rubric="currentRubric" allow-comments="false"></div> <div class="row row-gap-medium"></div> </section> <section ng-show="isCurrentTab(\'annotation\')"> <div class="row row-gap-large"> <div class="col-xs-12 annotation-text" translate=""> Your reviewer has provided annotations for your project </div> </div> <div class="row row-gap-medium"> <div class="col-xs-12"> <a class="btn btn-primary btn-sm" href="{{annotation_link}}" download="" _target="_blank">{{ \'Download annotations\' | translate }}</a> </div> </div> <div class="row row-gap-huge"></div> </section> <section ng-if="critiquesAccessor" ng-show="isCurrentTab(\'feedback\')"> <div ng-if="hasFeedback && submission.result" class="flex-bio" ng-class="{\'send-right\': currentProject.is_career}"> <h3 ng-show="!currentProject.is_career" class="result-label h-slim-top"> {{ submission.result | resultLabel:{pluralize: true} }} <div ng-if="doesNotMeetCount > 0"> <h4 class="result-label"><span class="{{submission.result}}"></span>{{ doesNotMeetCount | pluralize: \'specification requires\':\'specifications require\' | translate }} {{ \'changes\' | translate }}</h4> </div> </h3> <div ng-if="currentProject.is_career && hasMentor" class="reviewer-bio" ng-click="displayReviewerBioModal()"> <img class="reviewer-bio-pic" ng-src="{{ mentor.avatar_url}}"> <div> <p class="pink">Reviewed by</p> <p>{{ mentor.name }}</p> </div> </div> </div> <div ng-if="submission.general_comment" class="row row-gap-medium"> <div class="col-xs-12" marked="submission.general_comment"></div> </div> <div critiques-editor="" critiques-accessor="critiquesAccessor" editable="false" is-career="currentProject.is_career"> </div> <div class="row row-gap-small"></div> <div ng-if="isResubmittable()" class="row row-gap-small"> <div class="col-xs-12 text-center"> <a ng-if="isResubmittable()" ui-sref="rubrics.start({rubricId: currentRubric.id})" class="btn btn-primary visible-xs"> <i class="glyphicon glyphicon-check"></i> {{ \'Resubmit\' | translate }} </a> <button ng-if="isResubmittable()" ui-sref="rubrics.start({rubricId: currentRubric.id})" class="btn btn-primary hidden-xs"> <i class="glyphicon glyphicon-check"></i> {{ \'Resubmit Project\' | translate }} </button> </div> </div> <div class="row row-gap-small"> <div class="col-xs-12 text-center"> <a class="wide-and-bold" ng-if="submission.archive_url" href="{{ submission.archive_url }}" download=""> <img src="/assets/images/download-icon.svg" class="icon-medium">&nbsp;{{ \'Download Project\' | translate }} </a> </div> </div> <div ng-if="commentsCount > 0" class="row row-gap-small"> <div class="col-xs-12 text-center"> <a href="" ng-click="showTab(\'code\')" class="cta-large"> <span class="badge badge-info text-center"> {{ commentsCount }} </span> &nbsp;{{ \'Code Review Comments\' | translate }} </a> </div> </div> <div class="row row-gap-medium"></div> </section> <section ng-show="isCurrentTab(\'audit\')"> <div audit-tab="" submission="submission" state="auditTabState"></div> </section> </div>  </div>  </div>  <div ng-if="currentProject.entitlement_required && !isUngradeable() && !hasActiveEntitlement" class="review-tab-body"> <div class="repurchase text-center"> <p> Interested in getting another {{ currentProject.name }}? </p> <a class="btn btn-primary" ng-click="goToCareerPortal()">{{ \'Back to Career Portal\' | translate }}</a> </div> </div> </div>  </div>  </div>  <div ng-show="isCurrentTab(\'feedback\') || isUngradeable()"> <div ng-if="!hasViewedResubmissionVideo() && isResubmittable()" class="row row-gap-small"> <div class="col-md-8 col-md-offset-2"> <div class="row"> <div class="col-md-3"> <div class="thumbnail thumbnail-bordered t-slim"> <img src="/assets/images/resubmission-video.jpg"> </div> </div> <div class="col-md-9"> <h3 translate="">Best practices for your project resubmission</h3> <p translate="">Ben shares 5 helpful tips to get you through revising and resubmitting your project.</p> <p class="caption"> <a href="" ng-click="showResubmissionVideo()"> <i class="glyphicon glyphicon-play-circle"></i>&nbsp;{{ \'Watch Video\' | translate }} </a> (3:01) </p> </div> </div> </div> </div> </div> <div ng-if="hasViewedResubmissionVideo() && isResubmittable() || isSubmissionByCurrentUser()" class="row row-gap-medium"> <div class="col-md-10 col-md-offset-1 text-center"> <div ng-if="hasViewedResubmissionVideo() && isResubmittable()"> <p> {{ \'Learn the\' | translate }} <a href="" ng-click="showResubmissionVideo()">{{ \'best practices for revising and resubmitting your project\' | translate }}</a>. </p> <br> </div> </div> </div> <div class="row row-gap-medium"></div> <div ng-if="!currentProject.entitlement_required && isSubmissionByCurrentUser() && currentProject.nanodegree_key" class="row row-gap-medium"> <div class="col-xs-12 text-center"> <a class="btn btn-secondary" ng-click="goToClassroomPath()">{{ \'Return to Path\' | translate }}</a> </div> </div>  <div class="visible-xs row row-gap-medium"> <div class="col-xs-12"> <div ng-show="!isUngradeable() && showStudentFeedback" class="locked-feedback-footer"> <div ng-switch="hoverValue"> <span ng-switch-when="1">{{ \'Flag this review\' | translate }}</span> <span ng-switch-when="2">{{ \'Disappointing\' | translate }}</span> <span ng-switch-when="3">{{ \'Below average\' | translate }}</span> <span ng-switch-when="4">{{ \'OK, could be better\' | translate }}</span> <span ng-switch-when="5">{{ \'Awesome review!\' | translate }}</span> <span ng-switch-default="">{{ \'Rate this review\' | translate }}</span> </div> <div class="star-rating"> <div uib-rating="" state-on="\'feedback-star-on\'" state-off="\'feedback-star-off\'" on-leave="hoverValue = null" on-hover="hoverValue = value" ng-model="studentFeedback.rating"></div> </div> </div> </div> </div> <footer sticky-footer="" ng-if="shouldShowAssessmentFooter()" class="row hidden-xs"> <div ng-show="!isUngradeable() && showStudentFeedback" class="floating-feedback-footer"> <div ng-switch="hoverValue"> <span ng-switch-when="1">{{ \'Flag this review\' | translate }}</span> <span ng-switch-when="2">{{ \'Disappointing\' | translate }}</span> <span ng-switch-when="3">{{ \'Below average\' | translate }}</span> <span ng-switch-when="4">{{ \'OK, could be better\' | translate }}</span> <span ng-switch-when="5">{{ \'Awesome review!\' | translate }}</span> <span ng-switch-default="">{{ \'Rate this review\' | translate }}</span> </div> <div class="star-rating"> <div uib-rating="" state-on="\'feedback-star-on\'" state-off="\'feedback-star-off\'" on-leave="hoverValue = null" on-hover="hoverValue = value" ng-model="studentFeedback.rating"></div> </div> </div> </footer> <div class="row row-gap-medium"></div> <div id="comment-wrapper"></div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/start.tmpl.html", '<div ng-controller="StartCtrl as ctrl" class="row row-gap-huge projects_start"> <div class="col-sm-6 col-sm-offset-3 text-center"> <h1>{{ ctrl.projectName }}</h1> <h3> {{ \'How would you like to submit your project?\' | translate }} </h3> <div class="row row-gap-medium"></div> <div class="buttons"> <div ng-if="ctrl.hasUploadType(\'zip\')" class="thumbnail"> <img ng-click="ctrl.redirectToSubmitMethod(\'zip\')" class="page-icon-md clickable" src="/assets/images/upload-zip.svg"> <div class="row row-gap-small"></div> <button ng-click="ctrl.redirectToSubmitMethod(\'zip\')" class="btn btn-default btn-min-width-sm"> {{ \'Upload zip file\' | translate }} </button> </div> <div ng-if="ctrl.hasUploadType(\'repo\')" class="thumbnail"> <img ng-click="ctrl.redirectToSubmitMethod(\'repo\')" class="page-icon-md clickable" src="/assets/images/select-github-repo.svg"> <div class="row row-gap-small"></div> <button ng-click="ctrl.redirectToSubmitMethod(\'repo\')" class="btn btn-default btn-min-width-sm"> {{ \'Select GitHub repo\' | translate }} </button> <div class="row row-gap-small small"> {{ "If you\'re unfamiliar with" | translate }} <br>{{ \'GitHub, choose "Upload zip file"\' | translate }}. </div> </div> <div ng-if="ctrl.hasUploadType(\'file\')" class="thumbnail text-center"> <img ng-click="ctrl.redirectToSubmitMethod(\'file\')" class="page-icon-md clickable" src="/assets/images/upload-file.svg"> <div class="row row-gap-small"></div> <button ng-click="ctrl.redirectToSubmitMethod(\'file\')" class="btn btn-default btn-min-width-sm"> {{ \'Upload file\' | translate }} </button> <div class="row row-gap-small small"> .zip, .pdf, .html, .md </div> </div> <div ng-if="ctrl.hasUploadType(\'link\')" class="thumbnail text-center"> <img ng-click="ctrl.redirectToSubmitMethod(\'link\')" class="page-icon-md clickable" src="/assets/images/submit-link.svg"> <div class="row row-gap-small"></div> <button ng-click="ctrl.redirectToSubmitMethod(\'link\')" class="btn btn-default btn-min-width-sm"> {{ \'Submit link\' | translate }} </button> </div> <div ng-if="ctrl.hasUploadType(\'text\')" class="thumbnail text-center"> <img ng-click="ctrl.redirectToSubmitMethod(\'text\')" class="page-icon-md clickable" src="/assets/images/upload-file.svg"> <div class="row row-gap-small"></div> <button ng-click="ctrl.redirectToSubmitMethod(\'text\')" class="btn btn-default btn-min-width-sm"> {{ \'Write submission\' | translate }} </button> </div> </div> <div class="row row-gap-medium"></div>  </div> </div> <div class="row row-gap-huge"> </div>')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/student-feedback-modal.tmpl.html", '<div class="projects_student-feedback-modal"> <ng-form class="form-horizontal" name="form"> <div class="modal-body"> <div class="star-description text-center" ng-switch="ctrl.hoverValue || ctrl.score"> <span ng-switch-when="1">{{ \'Flag this review\' | translate }}</span> <span ng-switch-when="2">{{ \'Disappointing\' | translate }}</span> <span ng-switch-when="3">{{ \'Below average\' | translate }}</span> <span ng-switch-when="4">{{ \'OK, could be better\' | translate }}</span> <span ng-switch-when="5">{{ \'Awesome review!\' | translate }}</span> <span ng-switch-default="">{{ \'Rate this review\' | translate }}</span> </div> <div class="star-rating text-center"> <div uib-rating="" state-on="\'feedback-star-on\'" state-off="\'feedback-star-off\'" on-leave="ctrl.hoverValue = null" on-hover="ctrl.hoverValue = value" ng-model="ctrl.score"></div> </div> <div ng-if="ctrl.score === 5" class="form-group row row-gap-medium"> <div class="col-xs-12 col-sm-10 col-sm-offset-1"> <textarea class="form-control" placeholder="Tell us about your review" ng-model="ctrl.feedback" id="comments" rows="5">\n          </textarea> </div> </div> <div ng-if="ctrl.score < 5"> <div class="form-group row"> <div class="col-xs-12 col-sm-10 col-sm-offset-1"> <div class="feedback-question" translate="">How could your review improve?</div> <div class="row btn-group" data-toggle="buttons"> <div class="col-xs-12 col-sm-6">  <label ng-click="ctrl.reason = \'unclear\'" class="btn"> <input type="radio" ng-model="ctrl.reason" name="reason" value="unclear" ng-required="ctrl.isRadioRequired()">{{ \'Feedback unclear\' | translate }} </label> </div> <div class="col-xs-12 col-sm-6">  <label ng-click="ctrl.reason = \'accuracy\'" class="btn"> <input type="radio" ng-model="ctrl.reason" name="reason" value="accuracy" ng-required="ctrl.isRadioRequired()">{{ \'accuracy issue\' | translate }} </label> </div> <div class="col-xs-12 col-sm-6">  <label ng-click="ctrl.reason = \'incomplete\'" class="btn"> <input type="radio" ng-model="ctrl.reason" name="reason" value="incomplete" ng-required="ctrl.isRadioRequired()">{{ \'review incomplete\' | translate }} </label> </div> <div class="col-xs-12 col-sm-6">  <label ng-click="ctrl.reason = \'other\'" class="btn"> <input class="btn" type="radio" ng-model="ctrl.reason" name="reason" value="other" ng-required="ctrl.isRadioRequired()">{{ \'other\' | translate }} </label> </div> </div> </div> </div> <div class="form-group row row-gap-medium"> <div class="col-xs-12 col-sm-10 col-sm-offset-1"> <textarea class="form-control" placeholder="Provide more details" ng-model="ctrl.feedback" id="comments" rows="5" ng-required="ctrl.score < 3">\n            </textarea> </div> </div> </div>  </div> <div class="row"> <div class="col-xs-12 col-sm-10 col-sm-offset-1"> <span class="notification" translate="">Your feedback is shared anonymously with your reviewer.</span> </div> </div> <div class="row row-gap-medium"> <div class="col-xs-12 col-sm-10 col-sm-offset-1"> <button class="btn btn-sm btn-primary" ng-disabled="ctrl.score === 0 || form.$invalid" type="submit" busy-click="ctrl.submitFeedback()">{{ \'submit\' | translate }}</button> </div> </div> </ng-form> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/submit-link.tmpl.html", '<div ng-controller="SubmitLinkCtrl as ctrl" class="row row-gap-huge projects_submit-repo"> <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-6 col-md-offset-3"> <div class="text-center"> <img class="page-icon" src="/assets/images/submit-link.svg"> <h1 translate="">Submit Link</h1> </div> <div class="row row-gap-large"></div> <div create-submission-form="" rubric-id="ctrl.rubricId" submission="ctrl.submission" transclusion-valid="ctrl.isValid" github-required="false" submit="ctrl.createSubmission()" is-career="ctrl.isCareer"> <h3 translate="">Project link</h3> <p class="text-left text-muted" translate=""> Check that your link is publicly accessible </p> <input type="text" required="" class="form-control" ng-model="ctrl.submission.url"> </div> </div> </div> <div class="row row-gap-huge"></div> ');
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/submit-repo.tmpl.html", '<div ng-controller="SubmitRepoCtrl as ctrl" class="row row-gap-huge projects_submit-repo"> <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-6 col-md-offset-3"> <div class="text-center"> <img class="page-icon" src="/assets/images/select-github-repo.svg"> <h1 translate="">Select your repository</h1> </div> <div class="row row-gap-large"></div> <div create-submission-form="" rubric-id="ctrl.rubricId" submission="ctrl.submission" transclusion-valid="ctrl.isValid" github-required="true" canary-enabled="ctrl.canaryEnabled" canary-metadata="ctrl.canaryMetadata" submit="ctrl.createSubmission()" is-career="ctrl.isCareer"> <div class="repo-list"> <div class="alert alert-danger" ng-if="!ctrl.hasRepos()" translate="NO_PUBLIC_REPOS"></div> <div ng-if="ctrl.hasRepos()"> <p translate="">Please ensure that your project is on the default branch</p> <div class="radio text-left" ng-repeat="repo in ctrl.repos"> <label> <input name="repo" ng-model="ctrl.selectedRepoFullName" ng-value="repo.full_name" class="pull-left" type="radio"> <div> <strong>{{repo.name}}</strong> <p class="caption"><small>{{repo.description}}</small></p> </div> </label> <div ng-if="!$last" class="row row-gap-small"></div> </div> </div> </div> </div> </div> </div> <div class="row row-gap-huge"> </div>')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/submit-text.tmpl.html", '<div ng-controller="SubmitTextCtrl as ctrl" class="row row-gap-large projects_submit-zip"> <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2"> <h1 class="text-center" translate="">Write your submission</h1> <div class="row row-gap-medium"></div> <div create-submission-form="" rubric-id="ctrl.rubricId" submission="ctrl.submission" github-required="false" transclusion-valid="ctrl.isValid()" submit="ctrl.createSubmission()"> <div ng-class="{\'has-error\': ctrl.fileErrorMessage}" class="form-group text-left" scroll-if="ctrl.fileErrorMessage"> <div class="row"> <div class="col-xs-12"> <h3 translate="">Name your file</h3> </div> </div> <div class="row"> <div class="col-xs-8"> <input type="text" ng-model="ctrl.filename" class="form-control"> </div> <div class="col-xs-4 form-error" ng-bind-html="ctrl.fileErrorMessage | translate"></div> </div> <div class="row row-gap-medium"> <div class="col-xs-6"> <h3 class="h-slim" translate="">Compose your submission</h3> </div> </div> <div class="row"> <uib-tabset class="col-xs-12 container" justified="true"> <uib-tab heading="{{ \'Compose\' | translate }}"> <div class="compose-content"> <div class="btn-group" uib-dropdown=""> <button id="split-button" type="button" class="btn btn-default btn-xs">{{ctrl.syntax === \'html\' ? \'HTML\' : \'Markdown\'}}</button> <button type="button" class="btn btn-default btn-xs" uib-dropdown-toggle=""> <span class="caret"></span> <span class="sr-only" translate="">Split button!</span> </button> <ul class="dropdown-menu" role="menu"> <li role="menuitem"><a href="" ng-click="ctrl.syntax = \'html\'">{{ \'HTML\' | translate }}</a></li> <li role="menuitem"><a href="" ng-click="ctrl.syntax = \'markdown\'">{{ \'Markdown\' | translate }}</a></li> </ul> </div> <div class="row row-gap-small"></div> <textarea rows="20" ng-model="ctrl.text" class="form-control"></textarea> </div> </uib-tab> <uib-tab heading="{{ \'Preview\' | translate }}"> <div class="preview-content"> <div ng-if="ctrl.syntax === \'html\'" class="submit-text-size submit-text-preview" ng-bind-html="ctrl.text"></div> <div ng-if="ctrl.syntax === \'markdown\'" marked="ctrl.text" class="submit-text-size submit-text-preview"></div> </div> </uib-tab> </uib-tabset> </div> </div> </div> </div> </div> <div class="row row-gap-small"></div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("projects/templates/submit-zip.tmpl.html", '<div ng-controller="SubmitZipCtrl as ctrl" class="row row-gap-huge"> <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-6 col-md-offset-3"> <div class="text-center"> <img ng-if="fileType === \'archive\'" class="page-icon" ng-src="{{zipImgSource}}" alt="zip folder icon"> <img ng-if="fileType === \'pdf\'" class="page-icon" ng-src="{{pdfImgSource}}" alt="pdf icon"> <h1 ng-if="fileType === \'archive\'">{{archiveHeader | translate}}</h1> <h1 ng-if="fileType === \'pdf\'">{{ \'Upload your file\' | translate }}</h1> </div> <div class="row row-gap-small"></div> <div create-submission-form="" rubric-id="ctrl.rubricId" submission="ctrl.submission" github-required="false" transclusion-valid="ctrl.isValid" submit="ctrl.createSubmission()" submit-btn-text="ctrl.submitBtnText" canary-enabled="ctrl.canaryEnabled" canary-metadata="ctrl.canaryMetadata" is-career="ctrl.isCareer"> <div class="row row-gap-small"></div> <p ng-if="fileType === \'archive\'">{{ \'Compress your project file(s) into a single zip file on your computer.\' | translate }}</p> <p ng-if="fileType === \'pdf\'">{{ \'Upload your zip, pdf, html or md file.\' | translate }}</p> <div ng-class="{\'has-error\': ctrl.fileErrorMessage}" class="form-group text-left" scroll-if="ctrl.fileErrorMessage"> <div class="row"> <div class="col-xs-8 col-md-7"> <button ngf-select="" ng-model="ctrl.genericFiles" type="button" class="btn btn-default blue-grey lighten-4" accept="{{acceptHeader}}"> {{ \'Choose file\' | translate }} </button> &nbsp;{{ ctrl.isValid ? ctrl.getSelectedFile().name : \'no file chosen\' | translate }} <p class="caption p-slim"><small>{{ctrl.rubric.max_upload_size_mb}} {{\'MB limit (uncompressed)\' | translate }}</small></p> </div> <div class="col-xs-4 form-error" ng-bind-html="ctrl.fileErrorMessage | translate"> </div> </div> </div> </div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/directives/audits-list.tmpl.html", '<table class="table borderless"> <thead> <th translate="">Date of Audit</th> <th translate="">Audit</th> </thead> <tr ng-repeat="audit in audits"> <td class="col-md-3 col-xs-4"> {{ audit.completed_at | amDateFormat:\'LL\' }} </td> <td class="col-md-9 col-xs-8"> <div ng-if="!audit.read_at" class="pill pill-new pull-right">{{ \'New Audit\' | translate }}</div> <a ui-sref="reviews-show({submissionId: audit.submission_id, audit: 1})"> {{ audit.submission_project.name }} </a> <p class="caption caption-small p-slim">{{ audit.result | resultLabel:{pluralize: true} }}</p> </td> </tr> </table>')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/directives/certification-status.tmpl.html", '<div class="vertical-subway vertical-subway-small"> <div class="row"> <div class="col-xs-12"> <div class="subway-sign"> <span class="glyphicon" ng-class="{\'glyphicon-ok\': certification.training.status === \'passed\', \'glyphicon-lock\': certification.training.status === \'locked\', \'filled-circle\': [\'passed\', \'locked\'].indexOf(certification.training.status) === -1}"> </span> </div> <div class="subway-content"> <span ng-if="certification.status === \'applied\' && !submissionPassed"><b translate="">Application in progress</b></span> <span ng-if="certification.status === \'applied\' && submissionPassed"><b translate="">Applied</b></span> <span ng-if="certification.status === \'shortlisted\'"><b translate="">Applied</b></span> <span ng-if="certification.status === \'blocked\'"><b translate="">Ineligible</b></span> <span ng-if="certification.status === \'training\'"><b translate="">Onboarding in progress</b></span> <span ng-if="certification.status === \'certified\'"><b translate="">Certified, active reviewer</b></span> <span ng-if="certification.status === \'inactive\'"><b translate="">Certified, inactive reviewer</b></span> </div> </div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/directives/certification-view.tmpl.html", '<div ng-if="loading" class="loading"> </div> <div ng-if="!loading">  <div class="row row-gap-small"> </div> <div class="vertical-subway vertical-subway-small"> <div class="row" ng-repeat="onboarding in certification.trainings"> <div class="col-xs-12"> <div class="subway-sign"> <span class="glyphicon" ng-class="{\'glyphicon-ok\': onboarding.status === \'passed\', \'glyphicon-lock\': onboarding.status === \'locked\', \'filled-circle\': [\'passed\', \'locked\'].indexOf(onboarding.status) === -1}"> </span> </div> <div class="subway-content"> <p ng-class="{caption: [\'locked\', \'passed\'].indexOf(onboarding.status) !== -1}"> {{ \'Onboarding review\' | translate }} {{$index + 1}}{{ onboarding.status | onboardingStatusLabel }} </p> <div> <div ng-if="onboarding.status === \'not_started\'"> <button class="btn btn-secondary" busy-click="start(onboarding.id)"> {{ \'Start Onboarding\' | translate }} </button> <div class="row row-gap-small"></div> <p class="caption-small"> {{ONBOARDING_TIME_LIMIT_MESSAGE}} </p> </div> <div ng-if="onboarding.status !== \'not_started\'"> <div ng-repeat="onboarding_submission in onboarding.training_submissions"> <h4 ng-if="onboarding.onboarding_submission.length > 1 || onboarding.status === \'failed\'" class="h-slim"> {{ \'Attempt\' | translate }} {{$index + 1}} </h4> <div ng-if="!$last"> <a ui-sref="reviews-show({submissionId: onboarding_submission.id, audit: 1})"> {{ \'View feedback\' | translate }} </a> </div> <div ng-if="$last"> <div ng-if="onboarding.status === \'in_progress\'"> <a class="btn btn-secondary" ui-sref="submissions.show({submissionId: onboarding_submission.id})"> {{ \'Continue onboarding\' | translate }} </a> <p></p> <p class="caption-small p-slim"> {{ \'Time left:\' | translate }} {{ onboarding_submission | submissionAssignmentTimeRemaining }} </p> </div> <p class="caption-small" ng-if="onboarding.status === \'in_audit\'" translate=""> Thanks for submitting! A Udacity Coach will be auditing your review within 2 weeks. </p> <div ng-if="onboarding.status === \'failed\' || onboarding.status === \'passed\'"> <a ui-sref="reviews-show({submissionId: onboarding_submission.id, audit: 1})"> {{ \'View feedback\' | translate }} </a> </div> <div ng-if="onboarding.status === \'failed\'"> <div class="row row-gap-small"></div> <h4 class="h-slim">{{ \'Attempt\' | translate }} {{$index + 2}}</h4> <p translate="">Revise your last review based on the Coach\'s feedback.</p> <button class="btn btn-secondary" busy-click="start(onboarding.id)"> {{ \'Re-attempt\' | translate }} </button> <div class="row row-gap-small"></div> <p class="caption-small p-slim"> {{ONBOARDING_TIME_LIMIT_MESSAGE}} </p> </div> </div> <div class="row row-gap-small"></div> </div> </div> </div> </div> </div> </div> <div class="vertical-subway vertical-subway-small"> <div class="row"> <div class="col-xs-12"> <div class="subway-sign"> <span class="glyphicon" ng-class="{\'glyphicon-certificate\': certification.status === \'certified\' || certification.status === \'inactive\', \'filled-circle\': certification.status !== \'certified\' && certification.status !== \'inactive\'}"> </span> </div> <div class="subway-content"> <p ng-if="isCertified()" class="text-muted"><b translate="">Certified</b></p> <p ng-if="!isCertified()" class="text-muted"><b translate="">Certification</b></p> </div> </div> </div> </div> </div>  </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/directives/student-feedbacks-list.tmpl.html", '<p ng-if="ctrl.studentFeedbacks.length === 0"> <i translate="">You do not have any ratings.</i> </p> <div ng-if="ctrl.loading" class="loading"></div> <table class="table borderless" ng-if="ctrl.studentFeedbacks.length > 0"> <tr ng-repeat="studentFeedback in ctrl.studentFeedbacks"> <td class="col-md-2 col-xs-4"> <span uib-rating="" ng-model="studentFeedback.rating" readonly="true" ng-class="{\'background-transition\': isUpdating, black: studentFeedback.read_at}"> </span> </td> <td class="col-md-3 col-xs-4"> <a ui-sref="reviews-show({submissionId: studentFeedback.submission_id})" target="_blank"> {{ studentFeedback.project.name }} </a> </td> <td class="col-md-7 col-xs-4"> {{ studentFeedback.body }} <p class="caption"> <small am-time-ago="studentFeedback.created_at"></small> </p> </td> </tr> </table> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/templates/confirm-feedback-modal.tmpl.html", '<div> <button type="button" class="close hanging-close" aria-label="close" ng-click="$dismiss()"> </button> <div class="modal-header"> <h2 class="h-slim text-center" translate="">Confirm Submission</h2> </div> <form name="form" class="form-horizontal" novalidate=""> <div class="modal-body"> <div ng-if="submission.rubric.nomination_eligible"> <p> <label class="checkbox-inline"> <input type="checkbox" ng-model="ctrl.nominate">{{ \'Nominate this project for excellence.\' | translate }} </label> </p> <div ng-if="ctrl.nominate"> <div ng-show="!ctrl.isEditing()"> <div class="row row-gap-small"></div> <div marked="ctrl.nomination.reason"></div> <div class="row row-gap-small"></div> </div> <div ng-show="ctrl.isEditing()"> <div><strong translate="">Describe how this project was exceptional.</strong></div> <div markdown-textarea="" form="commentForm"> <textarea rows="4" required="" class="form-control" type="text" name="comment" ng-model="ctrl.nomination.reason">{{ body }}</textarea> </div> </div> </div>  </div>  <p class="text-center"> {{ \'By submitting, you agree that this review meets the\' | translate }} <a target="_blank" ui-sref="rubrics.view({ rubricId: 1144 })">{{ \'Review Quality Specifications\' | translate }}</a>. </p> <p class="text-center" ng-if="isOnboarding()"> {{ \'After submitting, a Udacity Coach will audit your review within 2 weeks.\' | translate }} </p> </div> <div class="modal-footer"> <div class="button-group pull-right"> <button ng-if="ctrl.nominate && ctrl.isEditing()" class="btn btn-secondary" ng-click="ctrl.toggleEdit()"> {{ \'Preview\' | translate }} </button> <button ng-if="ctrl.nominate && !ctrl.isEditing()" class="btn btn-secondary" ng-click="ctrl.toggleEdit()"> {{ \'Edit\' | translate }} </button> <button ng-disabled="ctrl.nominate && (ctrl.isEditing() || !ctrl.nomination.reason)" class="btn btn-primary" type="submit" ng-click="ctrl.submit()"> {{ \'Confirm Submission\' | translate }} </button> </div> </div> </form> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/templates/confirm-unassign-modal.tmpl.html", '<div> <button type="button" class="close hanging-close" aria-label="close" ng-click="$dismiss()"> </button> <div class="modal-header"> <h2 class="h-slim text-center" translate="">Confirm unassign</h2> </div> <div class="modal-body"> <p class="text-center"> {{ \'If you think a Udacity Coach should review this submission, please also email\' | translate }} <a href="mailto:review-support@udacity.com">review-support@udacity.com</a> {{ \'with the link to the submission\' | translate }}. </p> </div> <div class="modal-footer"> <div class="text-center full-width"> <button class="btn btn-danger" type="submit" ng-click="$close()"> {{ \'Delete review and unassign\' | translate }} </button> </div> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/templates/quality-specifications.tmpl.html", '<div class="row row-gap-small" ng-controller="QualitySpecificationsCtrl as ctrl"> <div class="col-md-8 col-md-offset-2"> <h1 translate="">Review Quality Specifications</h1> <p translate=""> Reviewers, follow these requirements for all reviews. Some reviews that do not meet our quality specifications may not be financially compensated. </p> <ul class="nav nav-tabs"> <li ng-class="{\'active\': ctrl.isSelectedTab(\'withCode\')}"> <a class="navbar-item" href="" ng-click="ctrl.showTab(\'withCode\')"> {{ \'Projects with code review\' | translate }} </a> </li> <li ng-class="{\'active\': ctrl.isSelectedTab(\'noCode\')}"> <a class="navbar-item" href="" ng-click="ctrl.showTab(\'noCode\')"> {{ \'Other projects\' | translate }} </a> </li> </ul> <section ng-if="ctrl.isSelectedTab(\'withCode\')"> <div class="row row-gap-small"></div> <div rubric-items-list="" rubric-id="ctrl.codeAuditRubricId"></div> </section> <section ng-if="ctrl.isSelectedTab(\'noCode\')"> <div class="row row-gap-small"></div> <div rubric-items-list="" rubric-id="ctrl.noCodeAuditRubricId"></div> </section> <div class="row row-gap-large"></div> </div> </div>')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/templates/ready.tmpl.html", '<div class="row row-gap-huge"> <div class="col-sm-4 col-sm-offset-4 text-center"> <img src="assets/images/graderOnboardComplete.svg" alt="" style="width:108px; height:87px;"> <h3 translate="">Great, You\'re Ready!</h3> <p translate="">The course will always be in your My Courses section for future reference.</p> <a ui-sref="submissions.dashboard" class="btn btn-lg btn-secondary">{{ \'Start Reviewing\' | translate }}</a> </div> </div> <div class="row row-gap-huge"></div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/templates/reviewer-faq.tmpl.html", '<div class="row row-gap-medium"> <div class="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 faq-content"> <h2>Reviewer FAQ</h2> <h3>How do I report a bug?</h3> <p>Please report the bug description to <a href="mailto:review-support@udacity.com">review-support@udacity.com</a> including screenshots and/or files if possible.</p> <h3>How do I report project / rubric issues?</h3> <p>Please report the issue to <a href="mailto:review-support@udacity.com">review-support@udacity.com</a> and include a description of the issue.</p> <h3>How do I escalate a submission to a coach for help?</h3> <p>Please email <a href="mailto:review-support@udacity.com">review-support@udacity.com</a> and include the submission number and information regarding what the issue is.</p> <h3>When should I mark a project as â€œCanâ€™t Reviewâ€?</h3> <p>A project should be marked as â€œCanâ€™t Reviewâ€ when you are unable to review the project. This might be due to missing files or an incorrect project submission.</p> <h3>Is there a minimum time requirement for project reviewing?</h3> <p>No, you can review as often as we have projects available, or as little as youâ€™d like. However, we do hope that you can complete project reviews within 2 hours of starting them to ensure students receive feedback as soon as possible.</p> <h3>Is there a maximum number of student submissions I can have in my dashboard to grade at one time?</h3> <p>Yes, the sum of the number of incomplete submissions assigned to you and the number of your submission requests on the reviewer queue can be at most five.</p> <h3>How will I receive payments?</h3> <p>You will receive payment for project reviews completed each month, around mid-month in your PayPal account. For example, reviews completed during September 2015 will be paid to you mid-October 2015.</p> <h3>How do I pay taxes? Will Udacity send me a 1099 form?</h3> <p>You will need to manage taxes based on the requirements of the country you reside in. PayPal will send a 1099 form on Udacityâ€™s behalf. US Reviewers can visit this <a href="https://www.irs.gov/Help-&-Resources/Tools-&-FAQs/FAQs-for-Individuals/Frequently-Asked-Tax-Questions-&-Answers/Interest,-Dividends,-Other-Types-of-Income/1099-MISC,-Independent-Contractors,-and-Self-Employed/1099-MISC,-Independent-Contractors,-and-Self-Employed-3">IRS help page</a> for additional information.</p> <h3>Why canâ€™t I see any projects?</h3> <p>It is possible other reviewers have picked up the submissions more quickly, reviewing is a first come/first serve system. As more students submit projects, more reviews will become available. Be sure to check that you have fully completed the onboarding for your projects.</p> <h3>What should I do if I disagree with a previous reviewer?</h3> <p>Please send a link to your review and the previous reviewerâ€™s review to <a href="mailto:review-support@udacity.com">review-support@udacity.com</a>, along with notes as to why you disagree with the previous reviewer.</p> <h3>What is dynamic pricing?</h3> <p>Dynamic pricing is a flexible and scalable model that allows Udacity to better develop and support our network of Udacity Reviewers, while simultaneously continuing to deliver on our promise to provide top-quality review services for our growing global student population. In a dynamic pricing model, fees for projects are flexible and may change based on factors such as: student and course volumes, reviewer availability for projects requiring differing degrees of technical expertise, â€œsurgeâ€ cycles of increased demand, and location-based economic factors that may impact program costs.</p> <h3>What are dispute resolution terms?</h3> <p>Dispute resolution terms can be found in our <a href="https://reviews.udacity.com/reviewer-agreement">Mentor Agreement</a> and establish a process for resolving disputes. The terms establish a 15-day window to resolve disputes informally. If a resolution is not achieved within 15 days, the dispute moves to an arbitration process, and a final resolution is achieved through arbitration.</p> </div> <br> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/templates/student-faq.tmpl.html", '<div class="row row-gap-medium"> <div class="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 faq-content"> <h2>Student Project Review FAQ</h2> <h3>All of my projects met specifications! When will I receive my certificate?</h3> <p>Once you have completed all required projects, you will be prompted to start your graduation process. This includes verifying your identity and completing a final reflection survey. Some students may or may not be asked to participate in an exit interview. If you have additional questions, please email <a href="mailto: graduation-review-support@udacity.com">graduation-review-support@udacity.com</a>.</p> <h3>When will my project be reviewed?</h3> <p> Project reviews are often completed in about 24 hours, something that Udacity strives for! As noted in your student handbook, "Due to the high volume of submissions and the time it may take your project reviewer to give personalized feedback, the turnaround period for project evaluations may be up to 1 week." Your student handbook can be found in your "Resources" section in your student portal. </p> <h3>I forgot a file or need to make a change to my project! How do I cancel a submission?</h3> <p> You can view instructions on how to cancel a project <a href="https://udacity.zendesk.com/hc/en-us/articles/210743526-How-do-I-cancel-a-project-submission-">here</a>. If your project is already being reviewed you will not have the option to cancel it.</p> <h3>How do I zip my project to upload it for review?</h3> <p>We have instructions on how to zip a file <a href="https://docs.google.com/document/d/1jPCDXBuD4xV8PsGLa5K9Fpn_9lSCTrXeOWcUKQGnATU/edit#heading=h.9pqdvn5gx0xl">here</a>.</p> <h3>I have a question about my review!</h3> <p> Contact <a href="mailto:review-support@udacity.com">review-support@udacity.com</a> with a link to the review and your questions. </p> <h3>How can I ask a reviewer a question about my feedback?</h3> <p> Contact <a href="mailto:review-support@udacity.com">review-support@udacity.com</a> with a link to the review and your questions. </p> <h3>My project didnâ€™t receive a status of "Exceeds Specifications" - why is that?</h3> <p> Exceeds Specifications is no longer used for Project Reviews. All submissions will receive a response of either â€œMeets Specificationsâ€ or â€œRequires Changesâ€. You can find more info <a href="https://discussions.udacity.com/t/exceeds-specifications-will-be-retired-on-march-31/161702">here</a>.</p> <h3>Iâ€™m trying to submit my project and get the following error: â€œYour zip file contains more than 1,000 files. Please re-submit a smaller zip file.â€</h3> <p><strong>Android:</strong> Did you try cleaning your project? Often, the 1000 file limit error occurs because of the files that are generated in the build folder of your app at the time of building your project. These files can be generated by the code reviewers, so feel free to remove them. Hereâ€™s a <a href="https://docs.google.com/document/d/1eYvuXY7GRE6VQpq4Rp-KotU1ti-JEySN1KdyKwjhzEQ/pub?embedded=true">document</a> that explains how to clean your project on Android Studio before you generate a zip or push the application on Github! If you have additional issues please contact <a href="mailto:review-support@udacity.com">review-support@udacity.com</a>.</p> <p><strong>FEND:</strong> Have you checked to see if you included the node_modules folder? This folder can include multiple files that can cause this error. You can find more information regarding how to clean up the node_modules from your project <a href="https://discussions.udacity.com/t/how-to-remove-node-modules-directory-from-github-respository/40929">here</a>. If you have additional issues please contact <a href="mailto:review-support@udacity.com">review-support@udacity.com</a>.</p> <p><strong>iOS:</strong> Sometimes Xcode can create a hidden directory structure in the project folder. Before doing anything we highly recommend you backup your entire project! Once it has been backed up you\'ll need to find the hidden directory and remove it. This should now allow you to upload your project. If you have additional issues please contact <a href="mailto:review-support@udacity.com">review-support@udacity.com</a>.</p> <h3>Iâ€™m trying to submit my project and get the following error: â€œYou can\'t resubmit because you already have a submission outstanding.â€</h3> <p>This error appears when you already have a submission awaiting review for the project in the system. If you believe you have seen this in error please contact <a href="mailto:review-support@udacity.com">review-support@udacity.com</a>.</p> <h3>Iâ€™m trying to submit my project and get an error mentioning I have the wrong file type.</h3> <p>This error appears when you submit a file type that is not supported for the project. When submitting you should see under the option "Upload File" a list of the file types we accept for the project.</p> <h3>Iâ€™m trying to resubmit my project but received an error stating that I can\'t resubmit because I\'ve already passed this project. How do I resubmit?</h3> <p>We think of projects as a way for the student to demonstrate mastery of a certain set of skills. Once a project has met specifications, we expect the student to want to move on to the next set of skills. So there currently is no way to resubmit a project. You can see the result of your project submission at the top of the "Project Review" tab on the review of your project.</p> <h3>How do I become a reviewer?</h3> <p> Go to our <a href="https://review.udacity.com/apply.html">application page</a> for more information.</p> </div> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/templates/submission-details.tmpl.html", '<div class="row row-gap-medium"> <div class="col-md-8 col-md-offset-2"> <h1 class="h-slim">{{ currentProject.name }}</h1> <h4 ng-if="submission.previous_submission_id">{{ \'REVISED REVIEW\' | translate }}</h4> <div class="plagiarism-alert" ng-if="hasPlagiarizedSubmission()"> <p>âš ï¸&nbsp;<strong>Plagiarism warning:</strong> a previous version of this studentâ€™s submission was found to be plagiarized. Be sure to compare the latest submission against previous versions to make sure that all problems were addressed.</p> </div> <ul class="nav nav-tabs"> <li ng-if="!currentProject.is_cert_project" ng-class="{\'active\': currentTab == \'\'}"> <a class="navbar-item" href="" ng-click="showTab(\'\')">{{ \'Student Notes\' | translate }}</a> </li> <li ng-class="{\'active\': currentTab == \'resources\'}"> <a class="navbar-item" href="" ng-click="showTab(\'resources\')"> {{ \'Resources\' | translate }}</a> </li> <li ng-if="isCodeShown()" ng-class="{\'active\': currentTab == \'code\'}"> <a class="navbar-item" href="" ng-click="showTab(\'code\')">{{ \'Code Review\' | translate }}</a> </li> <li ng-if="isAnnotationShown()" ng-class="{\'active\': currentTab == \'annotation\'}"> <a class="navbar-item" href="" ng-click="showTab(\'annotation\')">{{ \'Annotations\' | translate }}</a> </li> <li ng-class="{\'active\': currentTab == \'feedback\'}"> <a class="navbar-item" href="" ng-click="showTab(\'feedback\')">{{ \'Project Review\' | translate }}</a> </li> <li ng-if="showPastReviews" ng-class="{\'active\': currentTab == \'reviews\'}"> <a class="navbar-item" href="" ng-click="showTab(\'reviews\')">{{ \'Project History\' | translate }}</a> </li> </ul> </div> </div> <div class="row row-gap-medium"> <div class="col-md-8 col-md-offset-2"> <section ng-show="currentTab == \'\'"> <div class="submission-notes" marked="submission.notes || \'_None provided_\'"></div> <div ng-if="submission.notes"> <div class="row row-gap-small"></div> <p ng-if="!isSubmissionCompleted()" class="like-link" ng-click="moveToAdditionalComment()"> <span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>&nbsp; {{ \'Reply to the student\' | translate }} </p> </div> </section> <section class="resources" ng-show="currentTab == \'resources\'"> <h3 translate="">Reviewer Toolkit</h3> <p ng-if="toolkit_url"><span ng-if="isToolkitBadgeVisible" class="badge">{{ \'New Update\' | translate }}</span> <a class="resource-toolkit" ng-click="updateToolkitLastView()" href="{{toolkit_url}}" download=""> {{ \'Download Reviewer Toolkit\' | translate }} </a> - {{ \'Updated on\' | translate}}: {{updatedOnText()}} </p> <p ng-if="!toolkit_url">{{ \'No toolkit available for download\' | translate }}</p> <h3 translate="">Project Rubric</h3> <p>{{ \'The\' | translate }} <strong translate="">Reviewer Tips column</strong> {{ \'in\' | translate }} <a ui-sref="rubrics.view({rubricId: currentRubric.id})">{{ \'the rubric\' | translate }}</a> {{ \'is only visible to reviewers. Feel free to refer to this rubric in comments to students\' | translate }}.</p> <h3 translate="">Project Description</h3> <p marked="currentRubric.description" ng-if="currentRubric.description && !currentProject.is_cert_project"></p> <p ng-bind-html="currentRubric.description" ng-if="currentRubric.description && currentProject.is_cert_project"></p> </section> <section ng-show="currentTab == \'code\'"> <p translate=""> Click a filename to expand the code, then click the line you wish to comment upon. We\'d like to see at least 5 comments, but hopefully more. Thanks! </p> <div code-review="" ng-if="files && currentRubric" files="files" rubric="currentRubric" allow-comments="!isSubmissionCompleted()"></div> </section> <section ng-show="currentTab == \'annotation\'"> <div class="row"> <div class="col-xs-12" translate=""> Enhance the Project Review by annotating the studentâ€™s submission. </div> </div> <h3 translate="">Attach annotated .pdf</h3> <p translate="">If you have multiple annotation files, merge them into a single .pdf</p> <div ng-class="{\'has-error\': pdfErrorMessage}" class="form-group text-left"> <div class="row"> <div class="col-xs-8 col-md-7"> <button ngf-select="" ng-model="pdfFile" type="button" class="btn btn-default" accept="application/pdf"> {{ \'Choose file\' | translate }} </button> &nbsp;{{ pdfName ? pdfName : \'no file chosen\' | translate }} <p class="caption p-slim"><small translate="">10 MB limit</small></p> </div> <div class="col-xs-4 form-error" ng-bind-html="pdfErrorMessage"></div> </div> </div> <h3 translate="">Guide</h3> <div class="vertical-subway vertical-subway-small"> <div class="row"> <div ng-if="submission.url" class="col-xs-12"> <div class="subway-sign"> <span class="glyphicon filled-circle">&nbsp;</span> </div> <div class="subway-content"> <p> {{ \'Take a full-length screenshot of the studentâ€™s submission using a tool such as\' | translate }} <a href="https://chrome.google.com/webstore/detail/save-to-google-drive/gmbmikajjgmnabiglmofipeabaddhgne?hl=en" target="_blank" translate="">Save to Google Drive</a>. </p> </div> </div> </div> <div class="row"> <div class="col-xs-12"> <div class="subway-sign"> <span class="glyphicon filled-circle"></span> </div> <div class="subway-content"> <p>{{ \'Import the studentâ€™s submission into an annotation tool such as\' | translate }} <a href="https://web.kamihq.com/" target="_blank" translate="">Kami</a>, {{ \'which is free and web-based\' | translate }}.</p> <p translate="">{{ \'Use the various types of annotations to give the student constructive and positive feedback\' | translate }}.</p> <div class="row row-gap-small"> <div class="col-xs-12"> <p> <img class="page-icon page-icon-gutter" src="/assets/images/annotations-chart.svg"> <img class="page-icon page-icon-gutter" src="/assets/images/annotations-text.svg"> </p> </div> </div> <div class="row row-gap-small"> <div class="col-xs-12"> <p translate="">Start your comments with a label "Required:" "Suggestion:" or "Awesome:"</p> <p> <img class="page-icon-gutter" src="/assets/images/required.svg"> <img class="page-icon-gutter" src="/assets/images/suggestion.svg"> <img class="page-icon-gutter" src="/assets/images/awesome.svg"> </p> </div> </div> </div> </div> </div> <div class="row"> <div class="col-xs-12"> <div class="subway-sign"> <span class="glyphicon filled-circle"></span> </div> <div class="subway-content" translate=""> Export the annotated file as a .pdf </div> </div> </div> </div> </section> <section ng-show="currentTab == \'feedback\'"> <div ng-if="!isOnboardingSubmission && !isSubmissionCompleted() && !currentProject.is_cert_project"> <p translate="">Are you unable to review the project due to a compilation error, missing files, etc.? Is this submission plagiarized? Do you need to report the student for abusive language?</p> <button type="button" class="btn btn-default" ng-click="showUngradeableModal()"> {{ \'Can\\\'t review\' | translate }} </button> <div class="row row-gap-medium"></div> </div> <div ng-if="!hasCritiques"> {{ \'This project is a non-graded project. Your only job as a reviewer is to provide a code review.\' | translate }} </div> <div ng-if="hasCritiques && critiquesAccessor"> <div critiques-editor="" critiques-accessor="critiquesAccessor" editable="!isSubmissionCompleted()" state="critiquesState" submission="submission"> </div> </div> <div class="row row-gap-small"></div> </section> <section ng-if="pastReviews.length > 0" ng-show="currentTab == \'reviews\'"> <p ng-if="latestReview" translate=""> Youâ€™re reviewing a resubmission. For continuity, you can reference the studentâ€™s past submissions and reviews. We recommend that you draft an independent review of the project before viewing past reviews. </p> <p ng-if="!latestReview" translate=""> This is a past submission. See below for the full submission history. </p> <div reviews-list="" reviews="pastReviews" this-review="submission"></div> </section> </div> </div>  <div class="row row-gap-medium"></div> <div class="row row-gap-huge"></div> <footer sticky-footer="" class="assessment-footer row"> <hr class="hr-slim"> <div class="col-xs-12 col-md-8 col-md-offset-2"> <a ng-if="submission.archive_url" href="{{ submission.archive_url }}" class="download btn btn-default"> <i class="glyphicon glyphicon-download-alt"></i>&nbsp;{{ \'Download Project\' | translate }} </a> <a target="_blank" ng-if="submission.url" href="{{ submission.url }}" class="download btn btn-default"> <i class="glyphicon glyphicon-new-window"></i>&nbsp;{{ \'Project Link\' | translate }} </a> <div class="pull-right" ng-if="!isSubmissionCompleted()"> <a ng-if="!isOnboardingSubmission" href="" class="unassign" ng-click="confirmUnassign()"> {{ \'Unassign Myself\' | translate }} </a> <button busy-click="confirmEvaluationSubmit()" type="submit" ng-disabled="critiquesState.editing" class="btn btn-primary"> <i class="glyphicon glyphicon-check"></i> {{ \'Submit Feedback\' | translate }} </button> </div> </div> </footer> ');
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/templates/ungradeable-modal.tmpl.html", '<div> <button type="button" class="close hanging-close" aria-label="close" ng-click="$dismiss()"> </button> <div class="modal-header"> <p translate="UNGRADEABLE_TITLE"></p> </div> <form name="form" class="form-horizontal" novalidate=""> <div ng-if="ctrl.isEditing()"> <div class="modal-body"> <p> <span translate="UNGRADEABLE_TAG_INSTRUCTIONS"></span> </p> <div class="btn-group" uib-dropdown=""> <button id="split-button" type="button" class="btn btn-default btn-xs">{{ ctrl.selectedReason.text | translate }}</button> <button type="button" class="btn btn-default btn-xs" uib-dropdown-toggle=""> <span class="caret"></span> <span class="sr-only" translate="">Split button!</span> </button> <ul class="dropdown-menu" role="menu"> <li role="menuitem" ng-repeat="reason in ctrl.reasons"> <a href="" ng-click="ctrl.selectedReason = reason"> {{ reason.text | translate }} </a> </li> </ul> </div> </div> <div markdown-textarea="" form="ungradeableForm" class="ungradeable-modal-fieldgroup"> <div ng-if="ctrl.selectedReason.tag === \'plagiarism\'"> <p>{{ \'UNGRADEABLE_PLAGIARISM_SOURCE_INSTRUCTIONS\' | translate }}</p> <input ng-model="ctrl.plagiarismSourceUrl" class="form-control"> <p>{{ \'UNGRADEABLE_PLAGIARISM_INSTRUCTIONS\' | translate }}</p> </div> <p ng-if="ctrl.selectedReason.tag === \'missing_requirements\'"> {{ \'UNGRADEABLE_MISSING_REQUIREMENTS_INSTRUCTIONS\' | translate }} </p> <p ng-if="ctrl.selectedReason.tag === \'abuse\'"> {{ \'UNGRADEABLE_ABUSE_INSTRUCTIONS\' | translate }} </p> <p ng-if="ctrl.selectedReason.tag === \'language\'"> {{ \'UNGRADEABLE_LANGUAGE_INSTRUCTIONS\' | translate }} </p> <p ng-if="ctrl.shownToStudent()" style="margin-top:0px;"> <strong>{{ \'SHOWN_TO_STUDENT\' | translate }}</strong> </p> <textarea required="" ng-model="ctrl.notes" class="form-control" rows="4"></textarea> </div> <div class="modal-footer"> <div class="pull-left"> <button id="preview-button" class="btn btn-secondary" ng-disabled="ctrl.incomplete()" type="submit" ng-click="ctrl.toggleEdit()"> {{ \'Preview\' | translate }} </button> </div> </div> </div> <div ng-if="!ctrl.isEditing()"> <div class="modal-body"> <p ng-hide="ctrl.shownToStudent()" translate="UNGRADEABLE_ESCALATE_CONFIRMATION"></p> <p ng-show="ctrl.shownToStudent()" translate="UNGRADEABLE_REVIEW_CONFIRMATION"></p> <div ng-show="ctrl.plagiarismSourceUrl"> <h4 class="ungradeable-info" translate="" style="display: inline;"> Potential Source URL</h4> <a href="{{ctrl.plagiarismSourceUrl}}" ng-show="ctrl.plagiarismSourceUrl">{{ ctrl.plagiarismSourceUrl }}</a> </div> <div style="margin-top: 30px;"><strong translate="">Reviewer Comments</strong></div> <div class="inline-comment" marked="ctrl.notes"></div> </div> <div class="modal-footer"> <div class="pull-left inline"> <button class="btn btn-primary" ng-disabled="ungradeableForm.$invalid" type="submit" busy-click="ctrl.submit()"> {{ \'Submit\' | translate }} </button> <button class="btn btn-default" type="submit" ng-click="ctrl.toggleEdit()"> {{ \'Edit\' | translate }} </button> &nbsp;{{ \'For this submission, you will receive $\' | translate }}{{ctrl.project.ungradeable_price}}. </div> </div> </div></form> </div> ')
    }])
}(),
function(e) {
    try {
        e = angular.module("udacity.templates")
    } catch (t) {
        e = angular.module("udacity.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("submissions/templates/vote-feedback-modal.tmpl.html", '<div> <button type="button" class="close hanging-close" aria-label="close" ng-click="$dismiss()"> </button> <div ng-if="!ctrl.isEditing()"> <div class="modal-body"> <div class="row"> <div class="col-xs-10 col-xs-offset-1"> <h3>{{ \'Tell us about this review\' | translate }}</h3> <textarea ng-model="votes[ctrl.submissionId].feedback" wrap="soft" class="form-control" rows="3" placeholder="{{ ctrl.placeholder | translate }}"></textarea> </div> </div> </div> <div class="modal-footer"> <button class="btn btn-primary" type="button" ng-click="ctrl.submit()">{{ \'Submit\' | translate }}</button> </div> </div> </div>')
    }])
}();