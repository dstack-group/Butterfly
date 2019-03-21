package it.unipd.dstack.butterfly.producer.producer;

public interface Producer <V> extends ProducerSender<V>, Closeable, AwaitUntilError {

}
