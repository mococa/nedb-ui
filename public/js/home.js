$.ajaxSetup({ contentType: "application/json; charset=utf-8" });
var _file;
$(function () {
    files.forEach(file => {
        console.log(file)
        $('.file-name span').on('click', function (e) {
            $('.options').css('visibility', 'visible')
            if ($(this).text() == file.name) {
                $('.right').css('min-height', '-webkit-fill-available')
                $('.right').css('height', 'max-content')
                var jsonTree = JSONTree.create(file.content)
                _file = file
                $('.query .title').text(capitalize(file.name.split(/\.\w{2}/).join("")) + " collection")
                $('#fileTree').html(jsonTree)
                setClick()
            }

        })
    });
    if ($('.file-name span')) {
        $('.file-name span').eq(0).trigger('click')
    }
})
$('.options ul li').eq(0).on('click', function () {
    swal({
        title: "Save",
        icon: "warning",
        text: "Do you want to save the changes in this collection?",
        buttons: [true, "Yes"]
    }).then(val => {
        if (val) {
            const json = JSON.parse($('#fileTree').text())
            const arr = []
            for (const jsin of json) {
                arr.push(JSON.stringify(jsin))
            }
            console.log(arr.join("\n"))
            $.post('/request/savecollection', JSON.stringify({ fileName: _file.name, filePath: _file.path, fileContent: arr.join("\n") }), function (response) {
                if (response.status == 200) {
                    swal("Done", "Successfully saved", "success").then(() => {
                        location.reload()
                    })
                    //alert("Successfully saved.")
                } else {
                    swal("Oops", "Something went wrong", "error")
                    //swal("Oops", "Something went wrong", "error")
                }
                console.log(response)
            }).fail(function () {
                alert('failed')
            })
        }
    })
})
$('.options ul li').eq(1).on('click', function () {
    swal({
        title: "Empty",
        icon: "warning",
        text: "Do you want to empty this collection? All data will be lost.",
        buttons: [true, "Yes"]
    }).then(val => {
        if (val) {
            $.post('/request/emptycollection', JSON.stringify({ fileName: _file.name, filePath: _file.path }), function (response) {
                if (response.status == 200) {
                    swal("Done", "Successfully emptied", "success")
                    //alert("Successfully saved.")
                } else {
                    swal("Oops", "Something went wrong", "error")
                    //swal("Oops", "Something went wrong", "error")
                }
                console.log(response)
            }).fail(function () {
                alert('failed')
            })
        }
    })
})
$('.query-holder button').on('click', function () {
    var endpoint = ''
    $(this).index() == 2 ? endpoint = "addquery" : endpoint = "deletequery"
    $.post('/request/' + endpoint, JSON.stringify({
        query: $('.query-holder input').val(),
        fileName: _file.name,
        filePath: _file.path
    }), function (response) {
        if (response.status == 200) {
            swal("Done", "Successfully saved", "success")
            location.reload()
        } else {
            swal("Oops", "Something went wrong", "error")
        }
        console.log(response)
    }).fail(function () {
        swal("Oops", "Network error. Fail :(", "error")
    })

})
$('.collections div button').on('click', function () {
    swal({
        title: "Enter your new collection name",
        text: "(Don't forget the extension)",
        content: {
            element: "input",
            attributes: {
                placeholder: "something.db",
                type: "text",
            },
        },
    }).then(fileName => {
        if (fileName.length && fileName != null && (/.+\.\w{2}/g).test(fileName)) {
            $.post('/request/addcollection', JSON.stringify({
                fileName: fileName,
                filePath: _file.path
            }), function (response) {
                if (response.status == 200) {
                    swal("Done", "Successfully saved", "success").then(() => {
                        location.reload()
                    })
                } else {
                    swal("Oops", "Something went wrong", "error")
                }
                console.log(response)
            }).fail(function () {
                swal("Oops", "Network error. Fail :(", "error")
            })
        }
    })

})

$('li.file-name button').on('click', function () {
    var fileName = $(this).parent().children("span").text()
    swal({
        title: "Are you sure?",
        text: "You are about to the delete an entire collection!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                if (fileName != null && (/.+\.\w{2}/g).test(fileName)) {
                    $.post('/request/deletecollection', JSON.stringify({
                        fileName: fileName,
                        filePath: _file.path
                    }), function (response) {
                        if (response.status == 200) {
                            swal("Done", "Successfully deleted", "success").then(() => {
                                location.reload()
                            })

                        } else {
                            swal("Oops", "Something went wrong", "error")
                        }
                        console.log(response)
                    }).fail(function () {
                        swal("Oops", "Network error. Fail :(", "error")
                    })
                }
            }
        });
})


function setCode() {
    $('.code').on('keypress', function (e) {
        if (e.key == '{') {
            insertAtCare($(this), "}")
        } else if (e.key == '[') {
            insertAtCare($(this), "]")
        }
        else if (e.key == '"') {
            insertAtCare($(this), '"')
        }
    })
}
$('.query-holder input').addClass('code')
setCode()
function setClick() {
    $(function () {
        $.contextMenu({
            selector: "span.jstStr, span.jstNum, span.jstBool",
            callback: function (key, options) {
                if ($(this).text() != "_id") {
                    if (key == "refactor") {
                        var val = $(this).text()
                        if (val.includes('"')) {
                            val = val.split('"').join("")
                        }
                        try {
                            val = JSON.parse(val)
                            if (typeof val === 'boolean') {
                                $(this).attr('class', 'jstBool')
                            } else {
                                $(this).attr('class', 'jstNum')
                            }
                            $(this).text(val)
                        } catch (err) {
                            $(this).attr('class', 'jstStr')
                            if (!/^(\".+\")$/g.test($(this).text())) {
                                $(this).text('"' + $(this).text() + '"')
                            }
                        }
                    } else if (key == "edit") {
                        var newvalue = prompt("Type a new value for ", $(this).text().replaceAll(/\"/g, ""))
                        if (newvalue != null) {
                            if ($(this).text().includes('"')) {
                                $(this).html('"' + newvalue + '"')
                            } else {
                                $(this).html(newvalue)
                            }
                        }
                    } else if (key == 'addcomma') {
                        $(this).parent().append('<span class="jstComma">,</span>')
                    }
                }
                setClick()
            },
            items: {
                "refactor": { name: "Try to parse", icon: "fas fa-sync" },
                "edit": { name: "Edit value", icon: "edit" },
            }
        })
        $.contextMenu({
            selector: "span.jstProperty",
            callback: function (key, options) {
                if ($(this).text() != "_id") {
                    if (key == "rename") {
                        var newkey = prompt("Type a new value for " + $(this).text(), $(this).text().split('"').join(""))
                        if (newkey != null) {
                            $(this).html('"' + newkey + '"')
                        }
                    } else
                        if (key == "delete") {
                            if (confirm("Are you sure you want to delete " + $(this).text() + "?")) {
                                $(this).parent().remove()
                            }
                        } else
                            if (key == "clone") {
                                const clone = $(this).parent().clone()
                                $(clone).children('span.jstProperty').attr('class', 'jstProperty')
                                $(clone).appendTo($(this).parent().parent())
                                $(this).parent().append('<span class="jstComma">,</span>')
                                setClick()
                            }
                }

            },
            items: {
                "clone": { name: "Clone", icon: "copy" },
                "rename": { name: "Rename", icon: "edit" },
                "delete": { name: "Delete", icon: "delete" }
            }
        })
    })
}
function insertAtCare(input, val) {
    var cursorPos = $(input).prop('selectionStart');
    var v = $(input).val();
    var textBefore = v.substring(0, cursorPos);
    var textAfter = v.substring(cursorPos, v.length);
    $(input).val(textBefore + val + textAfter);
    $(input)[0].setSelectionRange(textBefore.length, textBefore.length);

}
function capitalize(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1, string.length).toLowerCase()
}