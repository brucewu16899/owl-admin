$(function ()
{
    $('.imageUploadMultiple').each(function (index, item)
    {
        var $item = $(item);
        var RenderPhotoTpl = $item.find('.RenderPhoto').first().html();
        var $group = $item.closest('.form-group');
        var $innerGroup = $item.find('.form-group');
        var $errors = $item.find('.errors');
        var $input = $item.find('.imageValue');
        var flow = new Flow({
            target: $item.data('target'),
            testChunks: false,
            chunkSize: 1024 * 1024 * 1024,
            query: {
                _token: $item.data('token')
            }
        });
        var updateValue = function ()
        {
            var values = [];
            $item.find('.thumbnail').each(function (index, thumb) {
                var $thumb = $(thumb);
                var src = $($thumb.find('img[data-src]')[0]).data('src');
                var title = $($thumb.find('input[type=title]')[0]).val();
                values.push({src: src, title: title});
            });
            $input.val(JSON.stringify(values));
        };
        var urlItem = function (src, url) {
            return renderTPL(RenderPhotoTpl, {
                src: src,
                url: url || ''
            });
        };
        flow.assignBrowse($item.find('.imageBrowse'));
        flow.on('filesSubmitted', function(file) {
            flow.upload();
        });
        flow.on('fileSuccess', function(file,message){
            flow.removeFile(file);

            $errors.html('');
            $group.removeClass('has-error');

            var result = $.parseJSON(message);

            $innerGroup.append( urlItem(result.value, result.url) );
            updateValue();
        });
        flow.on('fileError', function(file, message){
            flow.removeFile(file);

            var response = $.parseJSON(message);
            var errors = '';
            $.each(response, function (index, error)
            {
                errors += '<p class="help-block">' + error + '</p>'
            });
            $errors.html(errors);
            $group.addClass('has-error');
        });

        $item.on('click', '.imageRemove', function (e)
        {
            e.preventDefault();
            $(this).closest('.imageThumbnail').remove();
            updateValue();
        });
        $item.on('focusout', '.dataUrl', function (e)
        {
            e.preventDefault();
            // $(this).closest('.imageThumbnail').remove();
            updateValue();
        });
        $innerGroup.sortable({
            onUpdate: function ()
            {
                updateValue();
            }
        });

    });
});