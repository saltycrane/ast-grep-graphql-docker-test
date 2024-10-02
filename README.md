# ast-grep-graphql-docker-test

This is a test setup for [`ast-grep`](https://ast-grep.github.io/) and GraphQL using Docker. I created this since the [ast-grep Playground](https://ast-grep.github.io/playground.html) doesn't support GraphQL. The setup is similar to [this setup for Mac](https://www.saltycrane.com/blog/2024/09/how-use-ast-grep-graphql/), but modified for Ubuntu and Docker. It uses [this `tree-sitter-graphql`](https://github.com/bkegley/tree-sitter-graphql) grammar.

## Rule that does what I want

I included some sample source code and 2 rules. The first rule, `rules/find-graphql-types.yml`, finds GraphQL types that end with the string "Type". This does what I want.

``` yaml
id: find-graphql-types
language: graphql
rule:
  regex: Type$
  kind: named_type
```

## Rule that does not do what I want

The second rule, `rules/rename-graphql-types.yml`, attempts to rename those GraphQL types, removing the "Type" string at the end. This one gives me an error (see the "Usage" section below).

``` yaml
id: rename-graphql-types
language: graphql
rule:
  regex: Type$
  kind: named_type
  pattern: $OLD_TYPE
transform:
  NEW_TYPE:
    replace:
      source: $OLD_TYPE
      replace: (?<REG>.*)Type$
      by: $REG
fix: $NEW_TYPE
```

I tried to use a similar approach to some other renaming examples I found in [the ast-grep GitHub Discussions](https://github.com/ast-grep/ast-grep/discussions):

- [for HTML attributes](https://ast-grep.github.io/playground.html#eyJtb2RlIjoiQ29uZmlnIiwibGFuZyI6Imh0bWwiLCJxdWVyeSI6IjwkQSAkJCQgPiQkJDwvJEE+IiwicmV3cml0ZSI6IiIsInN0cmljdG5lc3MiOiJzbWFydCIsInNlbGVjdG9yIjoiIiwiY29uZmlnIjoicnVsZTpcbiAga2luZDogYXR0cmlidXRlXG4gIHJlZ2V4OiBcIjouKj1cIlxuICBwYXR0ZXJuOiAkT0xEX0FUVFJcbnRyYW5zZm9ybTpcbiAgTkVXX0FUVFI6XG4gICAgcmVwbGFjZTpcbiAgICAgIHNvdXJjZTogJE9MRF9BVFRSXG4gICAgICByZXBsYWNlOiA6KD88UkVHPi4qPSlcbiAgICAgIGJ5OiAkUkVHXG5maXg6ICRORVdfQVRUUiIsInNvdXJjZSI6IjxkaXY+XG4gIDxhcnRpY2xlIGNsYXNzPVwiZm9vXCI+XG4gICAgTG9yZW0gaXBzdW0uLi4uXG4gIDwvYXJ0aWNsZT5cbiAgPHAgY2xhc3M9XCJiYXJcIj5cbiAgICBMb3JlbSBpcHN1bS4uLi5cbiAgPC9wPlxuICA8ZGl2IGNsYXNzPVwiZm9vXCIgOmE9XCJhXCIgOmI9XCJiXCIgYz1cImNcIiA6ZD5cbiAgICBMb3JlbSBpcHN1bS4uLi5cbiAgPC9kaXY+XG4gIDxkaXYgOmM9XCJjXCI+PC9kaXY+XG48L2Rpdj5cbiJ9)
- [for JavaScript named imports](https://ast-grep.github.io/playground.html#eyJtb2RlIjoiQ29uZmlnIiwibGFuZyI6ImphdmFzY3JpcHQiLCJxdWVyeSI6IjwkQSAkJCQgPiQkJDwvJEE+IiwicmV3cml0ZSI6IiIsImNvbmZpZyI6ImlkOiBzY3JlZW4tY29udHJvbGxlclxubGFuZ3VhZ2U6IFRzeFxucnVsZTpcbiAga2luZDogaW1wb3J0X3NwZWNpZmllclxuICBwYXR0ZXJuOiAkTkFNRVxuICBpbnNpZGU6XG4gICAga2luZDogbmFtZWRfaW1wb3J0c1xuICAgIHJlZ2V4OiAoPzxOQU1FPi4qKShDb250cm9sbGVyKVxudHJhbnNmb3JtOlxuICBORVdfQ09OVFJPTExFUjpcbiAgICByZXBsYWNlOlxuICAgICAgYnk6IFNjcmVlbkNvbnRyb2xsZXJcbiAgICAgIHJlcGxhY2U6IENvbnRyb2xsZXJcbiAgICAgIHNvdXJjZTogJE5BTUVcbmZpeDogJE5FV19DT05UUk9MTEVSIiwic291cmNlIjoiaW1wb3J0IHtTb21lTmFtZUNvbnRyb2xsZXJ9ICBmcm9tICdAc2NyZWVucydcblxuIn0=)

## Usage

- Clone repo and change directory

    ``` sh
    git clone https://github.com/saltycrane/ast-grep-graphql-docker-test.git
    cd ast-grep-graphql-docker-test
    ```

- Build Docker image

    ``` sh
    docker build -t ast-grep-graphl-test .
    ```

- Run `ast-grep` `find-graphql-types.yml` rule. (This does what I want.)

    ``` sh
    docker run --rm -it ast-grep-graphql-test sg scan -r rules/find-graphql-types.yml src
    ```

    Results:

    ```
    help[find-graphql-types]:
      ┌─ src/SaveButton.tsx:9:15
      │
    9 │       $input: CreateWorksheetComparisonValuesInputType!
      │               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
    help[find-graphql-types]:
       ┌─ src/SaveButton.tsx:13:16
       │
    13 │         ... on OperationErrorType {
       │                ^^^^^^^^^^^^^^^^^^
    
    ```

- Run `ast-grep` `rename-graphql-types.yml` rule. (This does not do what I want.)

    ``` sh
    docker run --rm -it ast-grep-graphql-test sg scan -r rules/rename-graphql-types.yml src
    ```

    Results:

    ```
    Error: Cannot parse rule rules/rename-graphql-types.yml
    Help: The file is not a valid ast-grep rule. Please refer to doc and fix the error.
    See also: https://ast-grep.github.io/guide/rule-config.html
    
    ✖ Caused by
    ╰▻ Fail to parse yaml as Rule.
    ╰▻ `rule` is not configured correctly.
    ╰▻ Rule contains invalid pattern matcher.
    ╰▻ Multiple AST nodes are detected. Please check the pattern source `$OLD_TYPE`.
    ```
