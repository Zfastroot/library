FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
    )
FilePond.setOptions({    
    stylePanelAspectRatio: 150/100,
    imageResizeTargetWidth: 100 ,
    imageResizeTargetHight: 150 ,

})
FilePond.parse(document.body); 