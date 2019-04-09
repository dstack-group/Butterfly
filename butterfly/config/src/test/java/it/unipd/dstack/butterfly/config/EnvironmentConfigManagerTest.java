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

        String homeEnvVar = System.getenv("HOME");
        assertEquals(homeEnvVar, manager.readConfigValue("HOME"));
        assertEquals(homeEnvVar, manager.getStringProperty("HOME"));
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

        String homeEnvVar = System.getenv("HOME");
        assertEquals(homeEnvVar, manager.readConfigValue("HOME"));
        assertEquals(homeEnvVar, manager.getStringProperty("HOME"));

        /*
         * Setting a property doesn't work because getStringProperty check an environment variable and
         *  not a property :(
         */
        //System.setProperty("testing_string_property", "Test");
        //assertEquals("Test", manager.getStringProperty(""));
    }

}
