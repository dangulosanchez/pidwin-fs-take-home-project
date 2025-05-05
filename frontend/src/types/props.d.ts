type Lucky7Props = {
    user: UserDocument;
}

type RollsDisplayProps = {
    rolls: LiveRolls[];
}

type WagerProps = {
    user: UserDocument;
    onSubmitCallback: (response: Lucky7Response) => void;
}

type StreaksTableProps = {
  streaks: LiveStreaks[];
}

export type {
    Lucky7Props,
    RollsDisplayProps,
    StreaksTableProps,
    WagerProps
}