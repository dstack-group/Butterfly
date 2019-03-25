package it.unipd.dstack.butterfly.consumer.consumer.formatstrategy;

@FunctionalInterface
public interface FormatStrategy <T> {
    /**
     * Returns the appropriate formatted message from an input event object.
     * @param eventWithUserContact
     * @return
     */
    String format(T eventWithUserContact);
}
