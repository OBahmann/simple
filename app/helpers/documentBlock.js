define(['jquery', 'localizationManager', 'constants', ''], function ($, localizationManager, constants, xss) {
    return {
        getDocumentBlockContent: function (html) {
            var safeHtml = xss.filter(html),
                $output = $('<output>').html(safeHtml),
                $container = $output.find(constants.documents.containerSelector);

            var downloadText = localizationManager.getLocalizedText(constants.documents.downloadLocalizationKey);
            var documentData = {
                type: $container.attr(constants.documents.typeAttrName),
                size: +$container.attr(constants.documents.sizeAttrName)
            };

            var documentSizeString = getSize(documentData.size);
            var downloadBtnText = downloadText + ' (' + documentSizeString + ')';

            $output.find(constants.documents.downloadBtnSelector)
                .text(downloadBtnText);

            var iconClass = documentData.type === constants.documents.types.zip ? 'icon-zip' : 'icon-file';
            var $typeIcon = $('<div class="icon-container">' +
                '<span class="document-type-text">' + documentData.type + '</span>' +
                '</div>')
                .addClass(iconClass);
            var $typeIconWrapper = $('<div class="document-icon"></div>')
                .append($typeIcon);

            var $documentInfo = $(constants.documents.documentTitleWrapperSelector, $container)
                .prepend($typeIconWrapper);

            var content = $output.children()[0];
            return content;
        }
    };
    /**
     * Pluralize document size to user friendly string
     *
     * @param {Number} size - size of document in bytes
     * */
    function getSize(size) {
        var sizeStr = '';
        if (!size || size < 1024) {
            return '0 Kb';
        }
        sizeStr = (size / (1024 * 1024)).toFixed(2);

        return sizeStr + ' MB';
    }
});
