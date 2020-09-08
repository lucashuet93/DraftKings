SELECT a.FullName as 'QB', b.FullName as 'RB1', c.FullName as 'RB2', d.FullName as 'WR1', e.FullName as 'WR2', f.FullName as 'WR3', g.FullName as 'TE', h.FullName as 'FLEX', i.FullName as 'DST', l.ProjectedPoints,  l.TotalSalary
FROM [dbo].[DraftKingsLineups] l 
INNER JOIN [dbo].[DraftKingsAvailables] a ON l.QB=a.PlayerId
INNER JOIN [dbo].[DraftKingsAvailables] b ON l.RB1=b.PlayerId
INNER JOIN [dbo].[DraftKingsAvailables] c ON l.RB2=c.PlayerId
INNER JOIN [dbo].[DraftKingsAvailables] d ON l.WR1=d.PlayerId
INNER JOIN [dbo].[DraftKingsAvailables] e ON l.WR2=e.PlayerId
INNER JOIN [dbo].[DraftKingsAvailables] f ON l.WR3=f.PlayerId
INNER JOIN [dbo].[DraftKingsAvailables] g ON l.TE=g.PlayerId
INNER JOIN [dbo].[DraftKingsAvailables] h ON l.FLEX=h.PlayerId
INNER JOIN [dbo].[DraftKingsAvailables] i ON l.DST=i.PlayerId
ORDER BY l.ProjectedPoints DESC