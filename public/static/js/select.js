function initSelector(selectClass, placeholder, tags = false) {
    $(selectClass).select2({
        placeholder,
        tags
    });
}