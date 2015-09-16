//Follower variables
followedStreamers = null

//Alarm variables

updateInterval = null
desktopNotifs = null
soundAlarm = null
alarmVolume = null
soundInterval = null
restrictAlarm = null
restrictFrom = null
restrictTo = null
customAlarm = null
alarmLimit = null
alarmLength = null
uniqueIds = null
streamIds = null
deBounce = null

//Interface variables

liveQuality = null
livePath = null
hideAvatar = null
hideOffline = null
sortMethod = null
openTab = null
openLive = null
openPopout = null
previewWait = null
tutorialOn = null
hidePreview = null

//Other variables

curVersion = null

//Settings variables

searchTerm = ""
searchNum = 0

//HTML elements

followClear = document.getElementById("followdefault")
followAdd = document.getElementById("followinput")
followSubmit = document.getElementById("followsubmit")
followP1 = document.getElementById("followedp1")
followP2 = document.getElementById("followedp2")
followP3 = document.getElementById("followedp3")
followSearch = document.getElementById("followsearch")
followList = document.getElementById("followlist")
followRemove = document.getElementById("removeselected")
followImporter = document.getElementById("importinput")
followImport = document.getElementById("importsubmit")
followIfile = document.getElementById("importfile")
followEfile = document.getElementById("exportfile")

alarmDefault = document.getElementById("alarmdefault")
alarmWait = document.getElementById("updatelen")
alarmNotifs = document.getElementById("desktopnotifs")
alarmSound = document.getElementById("soundalarm")
alarmVol = document.getElementById("alarmvolume")
alarmSspan = document.getElementById("soundspan")
alarmInterval = document.getElementById("alarminterval")
alarmRestrict = document.getElementById("restrictalarm")
alarmRspan = document.getElementById("restrictspan")
alarmFrom = document.getElementById("restrictfrom")
alarmTo = document.getElementById("restrictto")
alarmCustom = document.getElementById("customalarm")

alarmMax = document.getElementById("maxalarm")
alarmLim = document.getElementById("alarmlimit")
alarmLen = document.getElementById("alarmlen")
alarmDeb = document.getElementById("debounce")
alarmId = document.getElementById("uniqueids")

interDefault = document.getElementById("interfacedefault")
interTutorial = document.getElementById("tutorial")
interHidepreview = document.getElementById("hidepreview")
interRadio = document.getElementById("sortradio")
interRecent = document.getElementById("sortrecent")
interViewers = document.getElementById("sortviewers")
interPreview = document.getElementById("previewwait")
interHideoff = document.getElementById("hideoff")
interHideavatar = document.getElementById("hideavatar")
interTab = document.getElementById("opentab")
interLive = document.getElementById("livestreamer")
interChat = document.getElementById("popout")
interSpan = document.getElementById("livespan")
interQual = document.getElementById("livequality")
interPath = document.getElementById("livepath")
interDark = document.getElementById("darkmode")

versionSpan = document.getElementById("versionspan")

function containsValue(list, obj) {
    if ((list.indexOf(obj)) > -1) {
        return true
    } else {
        return false
    }
}

//Tabs

var tabLinks = new Array()
var contentDivs = new Array()

function init() {
    var tabListItems = document.getElementById('tabs').childNodes
    for (var i = 0; i < tabListItems.length; i++) {
        if (tabListItems[i].nodeName == "LI") {
            var tabLink = getFirstChildWithTagName(tabListItems[i], 'A')
            var id = getHash(tabLink.getAttribute('href'))
            tabLinks[id] = tabLink
            contentDivs[id] = document.getElementById(id)
        }
    }
    var i = 0
    for (var id in tabLinks) {
        tabLinks[id].onclick = showTab
        tabLinks[id].onfocus = function() {
            this.blur()
        }
        if (i == 0) tabLinks[id].className = 'selected'
        i++
    }
    var i = 0
    for (var id in contentDivs) {
        if (i != 0) contentDivs[id].className = 'tabContent hide'
        i++
    }
}

function showTab() {
    var selectedId = getHash(this.getAttribute('href'))
    for (var id in contentDivs) {
        if (id == selectedId) {
            tabLinks[id].className = 'selected'
            contentDivs[id].className = 'tabContent'
        } else {
            tabLinks[id].className = ''
            contentDivs[id].className = 'tabContent hide'
        }
    }
    // Stop the browser following the link
    return false
}

function getFirstChildWithTagName(element, tagName) {
    for (var i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].nodeName == tagName) return element.childNodes[i]
    }
}

function getHash(url) {
    var hashPos = url.lastIndexOf('#')
    return url.substring(hashPos + 1)
}

//Follower settings

followClear.onclick = function() {
    followedStreamers = []
    updateSettings()
}

followAdd.onkeydown = function(e) {
    if (e.keyCode == 13) {
        if (followAdd.value != "") {
            var curvalue = followAdd.value
            curvalue = curvalue.replace(/ /g, "")
            curvalue = curvalue.replace(/\W/g, '')
            curvalue = curvalue.toLowerCase()
            if (!containsValue(followedStreamers, curvalue)) {
                followedStreamers.unshift(curvalue)
                updateSettings()
            }
        }
        followAdd.value = ""
    }
}

followSubmit.onclick = function() {
    if (followAdd.value != "") {
        var curvalue = followAdd.value
        curvalue = curvalue.replace(/ /g, "")
        curvalue = curvalue.replace(/\W/g, '')
        curvalue = curvalue.toLowerCase()
        if (!containsValue(followedStreamers, curvalue)) {
            followedStreamers.unshift(curvalue)
            updateSettings()
        }
    }
    followAdd.value = ""
}

followSearch.oninput = function() {
    searchTerm = followSearch.value
    updateFollowed()
}

document.onkeydown = function(e) {
    if (e.keyCode == 46) {
        if (followList.selectedIndex != "-1") {
            var indexkey = followedStreamers.indexOf(followList.value)
            followedStreamers.splice(indexkey, 1)
            updateSettings()
        }
    }
}

followRemove.onclick = function() {
    if (followList.selectedIndex != "-1") {
        var indexkey = followedStreamers.indexOf(followList.value)
        followedStreamers.splice(indexkey, 1)
        updateSettings()
    }
}

followImporter.onkeydown = function(e) {
    if (e.keyCode == 13) {
        if (followImporter.value != "") {
            addon.port.emit("importUser", followImporter.value)
        }
        followImporter.value = ""
    }
}

followImport.onclick = function() {
    if (followImporter.value != "") {
        addon.port.emit("importUser", followImporter.value)
    }
    followImporter.value = ""
}

followIfile.onchange = function() {
    var file = this.files[0]
    var reader = new FileReader()
    reader.onload = function(progressEvent) {
        var lines = this.result.split('\n')
        for (var key in lines) {
            if (lines[key] != "") {
                var curvalue = lines[key]
                curvalue = curvalue.replace(/ /g, "")
                curvalue = curvalue.replace(/\W/g, '')
                curvalue = curvalue.toLowerCase()
                if (!containsValue(followedStreamers, curvalue)) {
                    followedStreamers.push(curvalue)
                    updateSettings()
                }
            }
        }
        updateSettings()
    }
    reader.readAsText(file)
}

followEfile.onclick = function() {
    var textToWrite = createText()
    var textFileAsBlob = new Blob([textToWrite], {
        type: 'text/plain'
    })
    var fileNameToSaveAs = "followed_channels_" + (new Date().toJSON().slice(0, 10)) + ".txt"
    var downloadLink = document.createElement("a")
    downloadLink.download = fileNameToSaveAs
    downloadLink.textContent = "Download File"
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob)
    downloadLink.onclick = destroyClickedElement
    downloadLink.style.display = "none"
    document.body.appendChild(downloadLink)
    downloadLink.click()
}

//Alarm settings

alarmDefault.onclick = function() {
    //Default alarm settings

    updateInterval = 1
    desktopNotifs = true
    soundAlarm = true
    alarmVolume = 100
    alarmInterval = 1
    restrictAlarm = false
    alarmFrom = "22:00:00"
    alarmTo = "06:00:00"
    customAlarm = ""
    alarmLimit = false
    alarmLength = 10
    uniqueIds = true
    streamIds = []
    deBounce = 40
    updateSettings()
}

alarmWait.onchange = function() {
    updateInterval = alarmWait.value
    updateSettings()
}

alarmNotifs.onchange = function() {
    desktopNotifs = alarmNotifs.checked
    updateSettings()
}

alarmSound.onchange = function() {
    soundAlarm = alarmSound.checked
    updateSettings()
}

alarmVol.oninput = function() {
    alarmVolume = alarmVol.value
    updateSettings()
}

alarmInterval.onchange = function() {
    soundInterval = alarmInterval.value
    updateSettings()
}

alarmRestrict.onchange = function() {
    restrictAlarm = alarmRestrict.checked
    updateSettings()
}

alarmFrom.onchange = function() {
    var dat = (alarmFrom.value).replace(/\D/g, '')
    var dat2 = (alarmFrom.value).replace(/\d/g, '')
    if ((dat == "") || (dat2 != "::") || ((alarmFrom.value).length < 8)) {
        alarmFrom.value = restrictFrom
    } else {
        dat = Number(dat)
        if ((dat > 235959) || (dat < 0)) {
            alarmFrom.value = restrictFrom
        } else {
            restrictFrom = alarmFrom.value
            updateSettings()
        }
    }
}

alarmTo.onchange = function() {
    var dat = (alarmTo.value).replace(/\D/g, '')
    var dat2 = (alarmTo.value).replace(/\d/g, '')
    if ((dat == "") || (dat2 != "::") || ((alarmTo.value).length < 8)) {
        alarmTo.value = restrictTo
    } else {
        dat = Number(dat)
        if ((dat > 235959) || (dat < 0)) {
            alarmTo.value = restrictTo
        } else {
            restrictTo = alarmTo.value
            updateSettings()
        }
    }
}

alarmCustom.onchange = function() {
    customAlarm = alarmCustom.value
    updateSettings()
}

alarmLim.onchange = function() {
    alarmLimit = alarmLim.checked
    updateSettings()
}

alarmLen.onchange = function() {
    alarmLength = alarmLen.value
    updateSettings()
}

alarmDeb.onchange = function() {
    deBounce = alarmDeb.value
    updateSettings()
}

alarmId.onchange = function() {
    uniqueIds = alarmId.checked
    updateSettings()
}

//Interface settings

interDefault.onclick = function() {
    //Default interface settings

    liveQuality = "best"
    livePath = ""
    hideAvatar = false
    hideOffline = false
    hidePreview = false
    darkMode = false
    sortMethod = "recent"
    openTab = true
    openLive = false
    openPopout = false
    previewWait = 30
    tutorialOn = true
    updateSettings()
}

interTutorial.onchange = function() {
    tutorialOn = interTutorial.checked
    updateSettings()
}

interHidepreview.onchange = function() {
    hidePreview = interHidepreview.checked
    updateSettings()
}

interRecent.onclick = function() {
    if (interRecent.checked) {
        sortMethod = "recent"
    } else if (interViewers.checked) {
        sortMethod = "viewers"
    }
    updateSettings()
}

interViewers.onclick = function() {
    if (interRecent.checked) {
        sortMethod = "recent"
    } else if (interViewers.checked) {
        sortMethod = "viewers"
    }
    updateSettings()
}

interPreview.onchange = function() {
    previewWait = interPreview.value
    updateSettings()
}

interHideoff.onchange = function() {
    hideOffline = interHideoff.checked
    updateSettings()
}

interHideavatar.onchange = function() {
    hideAvatar = interHideavatar.checked
    updateSettings()
}

interTab.onchange = function() {
    openTab = interTab.checked
    updateSettings()
}

interLive.onchange = function() {
    openLive = interLive.checked
    updateSettings()
}

interChat.onchange = function() {
    openPopout = interChat.checked
    updateSettings()
}

interQual.onchange = function() {
    liveQuality = interQual.value
    updateSettings()
}

interPath.onchange = function() {
    livePath = interPath.value
    updateSettings()
}

interDark.onchange = function() {
    darkMode = interDark.checked
    updateSettings()
}

//Rest of script

function updateFollowed() {
    while (followList.firstChild) {
        followList.removeChild(followList.firstChild)
    }
    var searchcount = 0
    for (var key in followedStreamers) {
        if (followedStreamers[key].search(searchTerm) != -1) {
            searchcount += 1
            var newCard = document.createElement("option")
            newCard.value = followedStreamers[key]
            newCard.textContent = followedStreamers[key]
            followList.appendChild(newCard)
        }
    }
    searchNum = searchcount

    if (followedStreamers.length > 0) {
        if ((followedStreamers[0] != "") && (searchNum == followedStreamers.length)) {
            followP1.textContent = " (" + followedStreamers.length + ")"
            followP2.style.display = "none"
            followP3.textContent = ":"
        } else if ((followedStreamers[0] != "") && (searchNum != followedStreamers.length)) {
            followP1.textContent = " (" + followedStreamers.length + " "
            followP2.style.display = "inline"
            followP3.textContent = " " + searchNum + "):"
        } else {
            followP1.textContent = ""
            followP2.style.display = "none"
            followP3.textContent = ":"
        }
    } else {
        followP1.textContent = ""
        followP2.style.display = "none"
        followP3.textContent = ":"
    }
}

function updateSettings() {
    updateFollowed()

    alarmWait.value = updateInterval
    alarmNotifs.checked = desktopNotifs
    alarmSound.checked = soundAlarm
    alarmVol.value = alarmVolume
    if (soundAlarm) {
        alarmSspan.style.display = "inline"
    } else {
        alarmSspan.style.display = "none"
    }
    alarmLim.checked = alarmLimit
    if (alarmLimit) {
        alarmMax.style.display = "inline"
    } else {
        alarmMax.style.display = "none"
    }
    alarmInterval.value = soundInterval
    alarmRestrict.checked = restrictAlarm
    if (restrictAlarm) {
        alarmRspan.style.display = "inline"
    } else {
        alarmRspan.style.display = "none"
    }
    alarmFrom.value = restrictFrom
    alarmTo.value = restrictTo
    alarmCustom.value = customAlarm

    alarmLen.value = alarmLength
    alarmDeb.value = deBounce
    alarmId.checked = uniqueIds

    versionSpan.textContent = curVersion

    if (sortMethod == "recent") {
        interRecent.checked = true
        interViewers.checked = false
    } else if (sortMethod == "viewers") {
        interViewers.checked = true
        interRecent.checked = false
    }

    interTutorial.checked = tutorialOn
    interHidepreview.checked = hidePreview
    interHideoff.checked = hideOffline
    interHideavatar.checked = hideAvatar
    interTab.checked = openTab
    interLive.checked = openLive
    interPath.value = livePath
    interChat.checked = openPopout
    interPreview.value = previewWait
    interDark.checked = darkMode

    if (interLive.checked) {
        interSpan.style.display = "inline"
    } else {
        interSpan.style.display = "none"
    }
    if (liveQuality == "best") {
        interQual.selectedIndex = 0
    } else if (liveQuality == "source") {
        interQual.selectedIndex = 1
    } else if (liveQuality == "high") {
        interQual.selectedIndex = 2
    } else if (liveQuality == "medium") {
        interQual.selectedIndex = 3
    } else if (liveQuality == "low") {
        interQual.selectedIndex = 4
    } else if (liveQuality == "mobile") {
        interQual.selectedIndex = 5
    } else if (liveQuality == "worst") {
        interQual.selectedIndex = 6
    } else if (liveQuality == "audio") {
        interQual.selectedIndex = 7
    }

    exportSettings()
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target)
}

function createText() {
    var tex = ""
    for (var key in followedStreamers) {
        tex = tex + followedStreamers[key] + "\n"
    }
    return tex
}

function exportSettings() {
    addon.port.emit("importSettings", [
        followedStreamers,
        updateInterval,
        soundAlarm,
        alarmLimit,
        alarmLength,
        uniqueIds,
        streamIds,
        deBounce,
        liveQuality,
        hideAvatar,
        hideOffline,
        sortMethod,
        openTab,
        openLive,
        openPopout,
        previewWait,
        tutorialOn,
        livePath,
        soundInterval,
        restrictAlarm,
        restrictFrom,
        restrictTo,
        customAlarm,
        desktopNotifs,
        alarmVolume,
        hidePreview,
        darkMode
    ])
}

addon.port.on("onSettings", function(payload) {
    //console.log("Payload received")
    followedStreamers = payload[0]
    updateInterval = payload[1]
    soundAlarm = payload[2]
    alarmLimit = payload[3]
    alarmLength = payload[4]
    uniqueIds = payload[5]
    streamIds = payload[6]
    deBounce = payload[7]
    liveQuality = payload[8]
    hideAvatar = payload[9]
    hideOffline = payload[10]
    sortMethod = payload[11]
    openTab = payload[12]
    openLive = payload[13]
    openPopout = payload[14]
    previewWait = payload[15]
    tutorialOn = payload[16]
    livePath = payload[17]
    curVersion = payload[18]
    soundInterval = payload[19]
    restrictAlarm = payload[20]
    restrictFrom = payload[21]
    restrictTo = payload[22]
    customAlarm = payload[23]
    desktopNotifs = payload[24]
    alarmVolume = payload[25]
    hidePreview = payload[26]
    darkMode = payload[27]

    updateSettings()
})