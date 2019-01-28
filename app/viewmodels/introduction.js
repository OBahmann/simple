﻿define(['q', 'context', 'plugins/router', 'plugins/http', 'templateSettings', 'xss'],
    function (Q, context, router, http, templateSettings, xss) {
        var viewModel = {
            courseTitle: context.course.title,
            content: null,
            copyright: templateSettings.copyright,
            authorContactEmail: context.course.authorContactEmail,
            authorPersonalPhone: context.course.authorPersonalPhone,
            authorShortBio: context.course.authorShortBio,
            createdBy: context.course.createdBy,
            authorAvatarUrl: context.course.authorAvatarUrl,
            allowAuthorsBio: templateSettings.allowAuthorsBio,
            isNavigationLocked: router.isNavigationLocked()
        }

        viewModel.canActivate = function () {
            if (context.course.hasIntroductionContent == false && !viewModel.allowAuthorsBio) {
                return { redirect: '#sections' };
            }
            return true;
        };

        viewModel.activate = function () {
            return Q.fcall(function () {
                return context.course.hasIntroductionContent 
                    && http.get('content/content.html').then(function (response) {
                        viewModel.content = xss.filter(response);
                    }).fail(function () {
                        viewModel.content = '';
                    });
            });
        };

        viewModel.startCourse = function () {
            if (router.isNavigationLocked()) {
                return;
            }
            router.navigate('sections');
        }

        return viewModel;
    }
);