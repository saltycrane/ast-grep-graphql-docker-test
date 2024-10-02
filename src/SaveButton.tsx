import { graphql, useMutation } from "react-relay";

import { SaveButtonMutation } from "./__generated__/SaveButtonMutation.graphql";


const SaveButton = () => {
  useMutation<SaveButtonMutation>(graphql`
    mutation SaveButtonMutation(
      $input: CreateWorksheetComparisonValuesInputType!
    ) {
      saveWorksheetComparisonReportValues(input: $input) {
        __typename
        ... on OperationErrorType {
          ...useMyMutation_operationError
        }
      }
    }
  `)

  return null
};

export default SaveButton;
