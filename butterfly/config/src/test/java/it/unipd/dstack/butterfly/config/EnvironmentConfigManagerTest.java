package it.unipd.dstack.butterfly.config;

import it.unipd.dstack.butterfly.config.EnvironmentConfigManager;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EnvironmentConfigManagerTest {

    private EnvironmentConfigManager manager = new EnvironmentConfigManager();

    /**
     *  <p>Check if the readConfigValue method returns the right enviroment variable asked<p>
     *
     *  @author DStack Group
     *  @return void
     */

    @Test
    public void shouldReturnSome() {

        String homeEnvVar = System.getenv("JAVA_HOME");
        assertEquals(homeEnvVar, manager.readConfigValue("JAVA_HOME"));
        assertEquals(homeEnvVar, manager.getStringProperty("JAVA_HOME"));
    }


    /**
     *  <p>Check if the getStringProperty method returns the right enviroment variable asked<p>
     *  TODO: Check if there is a better way to test it because Java cannot let you set an environment variable
     *
     *  @author DStack Group
     *  @return void
     */

    @Test
    public void shouldReturnRightStringProperty() {

        String homeEnvVar = System.getenv("JAVA_HOME");
        assertEquals(homeEnvVar, manager.readConfigValue("JAVA_HOME"));
        assertEquals(homeEnvVar, manager.getStringProperty("JAVA_HOME"));
    }

}
