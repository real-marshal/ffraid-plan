# ffraid plan

## todo
- transformer - done
- selection - done
- export as waapi - done
- text - done
- share (export as brotli'd base64'd state in url) - done
- undo / redo
- shortcuts - done
- draggable entity list

## notes
- turned out you can't attach multiple tween objects to the same node which changes everything so now i'm going to go into a different direction: instead of trying to prevent rerendering of entities i'll make them controlled, surely just for timeline seeking purposes this should be ok

## adding new entities
1. update EntityType
2. if needed, add new props to EntityProps and entityTypeToProps
3. add new case to makeEntity factory
4. add new rendering case to Entities
5. add new button to VerticalMenu
6. review onTransformEnd if the entity adds new dimension props
7. update kfsToWaapi and konvaPropToWaapiPropMap
