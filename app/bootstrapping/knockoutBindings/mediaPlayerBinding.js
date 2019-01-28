define(['knockout', 'jquery'], function (ko, $) {
    ko.bindingHandlers.mediaPlayer = {
        init: function (element, valueAccessor) {

            var
                $element = $(element),
                args = valueAccessor(),
                embedCode = ko.utils.unwrapObservable(args.embedCode);

            $element.html(getMediaEmbedCode(embedCode));

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                var $iframe = $element.find('iframe');
                if ($iframe.length) {
                    $iframe.attr('src', 'about:blank');
                }
                $element.empty();
            });

            function getMediaEmbedCode(_embedCode) {
                if (!_embedCode)
                    return _embedCode;

                var srcAttrName = 'src',
                    $container = $('<div/>').html(_embedCode),
                    $iframe = $container.find('iframe'),
                    src = $iframe.attr(srcAttrName),
                    variablesList = getVariablesList();

                src += '&style_variables=' + encodeURIComponent(variablesList);

                $iframe.attr(srcAttrName, src);
                return $container.html();
            }
        }
    };

    function getVariablesList() {
        return window.LessProcessor && window.LessProcessor.vars ? JSON.stringify({ '@main-color': window.LessProcessor.vars['@main-color'], '@content-body-color': window.LessProcessor.vars['@content-body-color'], '@text-color': window.LessProcessor.vars['@text-color'] }) : undefined;
    }
})