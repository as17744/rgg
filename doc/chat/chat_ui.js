const divEscapedContentElement = (message) => $('<div></div>').text(message);
const divSystemContentElement = (message) => $('<div></div>').html(`<i>${message}</i>`);
const processUserInput = (chatApp) => {
    const message = $('#send-message').val();
    let systemMessage = '';
    if (message.charAt(0) === '/') {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            $('#message').append(divSystemContentElement(systemMessage));
        }
    } else {
        // chatApp.sendMessage($('#room').text(), message);
        console.log(divEscapedContentElement(message));
        $('#message').append(divEscapedContentElement(message));
        // $('#message').scrollTop($('#message').prop('scrollHeight'));
    }
    $('#send-message').val('');
}
export default {
    divEscapedContentElement,
    divSystemContentElement,
    processUserInput,
};