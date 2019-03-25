package it.unipd.dstack.butterfly.consumer.consumer.message;

public interface MessageSender <T extends Message> {
    /**
     * Forwards the given messaage to the appropriate service.
     * @param message
     */
    void sendMessage(T message) throws Exception;
}
