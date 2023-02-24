Feature: Basic player interaction

Rule: Player can interact with objects

Scenario Outline: A player attacking a bench
    Given a player focused on a bench
    When the player attacks the bench <times> times
    Then the bench should have <health> health left
    
    #Then the <texture> texture should show on the bench
    #Then the bench should be <destroyed> destroyed

    Examples:
        | times | health | texture       | destroyed |
        | 1     | 2      | bench         | not       |
        | 2     | 1      | broken-bench  | not       |
        | 3     | 0      | broken-bench  |           |
