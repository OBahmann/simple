define(['knockout', 'jquery', 'durandal/composition', 'helpers/documentBlock'], function (ko, $, composition, documentBlockHelper) {
    ko.bindingHandlers.contentBlock = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                html = valueAccessor(),
            
                dataType = getContentBlockType(html);
            
            switch(dataType){
                case 'hotspot': {
                    var hotspotOnImage = HotspotStorage.create($(html)[0]);
                        
                    $element.addClass('hotspot-on-image-container');
                    $element.html(hotspotOnImage.element);

                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        HotspotStorage.remove(hotspotOnImage);
                    });

                    break;
                }
                case 'document': {
                    var content = documentBlockHelper.getDocumentBlockContent(html);
                    $element.append(content);
                    break;
                }
                default: {
                    $element.html(html);
                    return ko.bindingHandlers.elementsWrap.init(element, valueAccessor);
                }
            }
        }
    };
    
    composition.addBindingHandler('contentBlock');
    
    function getContentBlockType(data) {
        var $output = $('<output>').html(data),
            dataType = $('[data-type]', $output).attr('data-type');
        
        return dataType;
    }
});