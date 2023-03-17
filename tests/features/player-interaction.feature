Feature: Basic player interaction

    Rule: Player can interact with objects

        Scenario Outline: A player attacking a bench
            Given a player focused on a bench
            When the player attacks the bench <times> times
            Then the bench should have a healthBar
            Then the bench should have <health> health left
            Then the bench should be <state>

            Examples:
                | times | health | state     |
                | 1     | 2      | fine      |
                | 2     | 1      | broken    |
                | 3     | 0      | destroyed |

