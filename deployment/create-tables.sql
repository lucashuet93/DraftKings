CREATE TABLE DraftKingsAvailables (
    Position varchar(255),
    FullNamePlayerIdCombination varchar(255),
    FullName varchar(255),
    PlayerId varchar(255),
    RosterPosition varchar(255),
    Salary int,
    GameInfo varchar(255),
    Team varchar(255),
    AveragePPG float
);

CREATE TABLE NumberFire (
    FullNameAndPosition varchar(255),
    ProjectedPoints float,
    Salary int,
    ProjectedValue float,
    CompletionsOverAttempts varchar(255),
    PassingYds int,
    PassingTds int,
    PassingInts int,
    RushingAtt int,
    RushingYds int,
    RushingTds int,
    Receptions int,
    ReceivingYds int,
    ReceivingTds int,
    Targets float
);

CREATE TABLE DailyFantasyFuel (
    FirstName varchar(255),
    LastName varchar(255),
    Position varchar(255),
    InjuryStatus varchar(255),
    GameDate varchar(255),
    Slate varchar(255),
    Team varchar(255),
    Opponent varchar(255),
    Spread float,
    OverUnder float,
    ImpliedTeamScore float,
    Salary int,
    Last5DvPRank int,
    Last5PPGFloor float,
    Last5PPGAverage float,
    Last5PPGCeiling float,
    ProjectedPoints float,
    ProjectedValue float,
    ActualPoints float,
    ActualValue float
);

CREATE TABLE RotoGrinders (
    FullName varchar(255),
    Salary varchar(255),
    Team varchar(255),
    Position varchar(255),
    Opponent varchar(255),
    ProjectedPoints float,
    ProjectedValue float
);

CREATE TABLE PlayerProjections (
    FirstName varchar(255),
    LastName varchar(255),
    PlayerId varchar(255),
    Position varchar(255),
    Salary int,
    Team varchar(255),
    Opponent varchar(255),
    RotoGrindersProjection float,
    NumberFireProjection float,
    DailyFantasyFuelProjection float,
    ProjectedPoints float,
    ProjectedValue float,,
    AveragePPG float
);

CREATE TABLE DraftKingsLineups (
    QB varchar(255),
    RB1 varchar(255),
    RB2 varchar(255),
    WR1 varchar(255),
    WR2 varchar(255),
    WR3 varchar(255),
    TE varchar(255),
    FLEX varchar(255),
    DST varchar(255),
    ProjectedPoints float,
    TotalSalary int
);
