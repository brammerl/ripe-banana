# ripe-banana

# To-dos: 

## GET Routes 

While the schemas should look like the data definitions above, these are descriptions of the data that should be returned from the various `GET` methods. You will need to use `lean`, `populate`, `select` and combining data to shape the appropriate response.

## 1. GET /reviews

**limit to 100 highest rated**

```
[{
    _id,
    rating,
    review,
    film: { _id, title }
}]
```

#### POST/PATCH

* POST: 
    Films 
    Reviews 
* PATCH: Only Reviewers can be updated.

#### DELETE

Reviews and Reviewers **However**:
1. Reviewers cannot be deleted if there are reviews
