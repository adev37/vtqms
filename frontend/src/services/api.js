import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Dev/prod base URL (Vite)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["MCQ", "TF", "FB", "User"],
  endpoints: (builder) => ({
    // ======= QUESTIONS (raw lists) =======
    getMcqQuestions: builder.query({
      query: () => "/api/questions",
      providesTags: (res) =>
        res?.questions
          ? [
              ...res.questions.map((q) => ({ type: "MCQ", id: q._id })),
              { type: "MCQ", id: "LIST" },
            ]
          : [{ type: "MCQ", id: "LIST" }],
    }),
    getTrueFalseQuestions: builder.query({
      query: () => "/api/truefalse",
      providesTags: (res) =>
        res?.questions
          ? [
              ...res.questions.map((q) => ({ type: "TF", id: q._id })),
              { type: "TF", id: "LIST" },
            ]
          : [{ type: "TF", id: "LIST" }],
    }),
    getFillBlankQuestions: builder.query({
      query: () => "/api/fillblank",
      providesTags: (res) =>
        res?.questions
          ? [
              ...res.questions.map((q) => ({ type: "FB", id: q._id })),
              { type: "FB", id: "LIST" },
            ]
          : [{ type: "FB", id: "LIST" }],
    }),

    // ======= QUESTIONS (category-scoped, cached by category) =======
    // These use queryFn so they still work even though the backend
    // doesn’t accept a category filter yet. Later we can switch to real
    // server-side filter/pagination without touching callers.
    getMcqByCategory: builder.query({
      // cache key = category string
      async queryFn(category, _api, _extra, fetchWithBQ) {
        const res = await fetchWithBQ("/api/questions");
        if (res.error) return { error: res.error };
        const all = res.data?.questions || [];
        const filtered = all.filter(
          (q) => q.category?.toLowerCase() === String(category).toLowerCase()
        );
        return { data: { questions: filtered } };
      },
      providesTags: (res, _err, category) =>
        res?.questions
          ? [
              ...res.questions.map((q) => ({ type: "MCQ", id: q._id })),
              { type: "MCQ", id: `LIST:${category}` },
            ]
          : [{ type: "MCQ", id: `LIST:${category}` }],
    }),
    getTFByCategory: builder.query({
      async queryFn(category, _api, _extra, fetchWithBQ) {
        const res = await fetchWithBQ("/api/truefalse");
        if (res.error) return { error: res.error };
        const all = res.data?.questions || [];
        const filtered = all.filter(
          (q) => q.category?.toLowerCase() === String(category).toLowerCase()
        );
        return { data: { questions: filtered } };
      },
      providesTags: (res, _err, category) =>
        res?.questions
          ? [
              ...res.questions.map((q) => ({ type: "TF", id: q._id })),
              { type: "TF", id: `LIST:${category}` },
            ]
          : [{ type: "TF", id: `LIST:${category}` }],
    }),
    getFBByCategory: builder.query({
      async queryFn(category, _api, _extra, fetchWithBQ) {
        const res = await fetchWithBQ("/api/fillblank");
        if (res.error) return { error: res.error };
        const all = res.data?.questions || [];
        const filtered = all.filter(
          (q) => q.category?.toLowerCase() === String(category).toLowerCase()
        );
        return { data: { questions: filtered } };
      },
      providesTags: (res, _err, category) =>
        res?.questions
          ? [
              ...res.questions.map((q) => ({ type: "FB", id: q._id })),
              { type: "FB", id: `LIST:${category}` },
            ]
          : [{ type: "FB", id: `LIST:${category}` }],
    }),

    // ======= BULK ADD (invalidate lists + per-category caches) =======
    bulkAddMcq: builder.mutation({
      query: (body) => ({
        url: "/api/questions/bulk-add",
        method: "POST",
        body,
      }),
      // Invalidate global list; category-specific lists will refetch when viewed
      invalidatesTags: [{ type: "MCQ", id: "LIST" }],
    }),
    bulkAddTrueFalse: builder.mutation({
      query: (body) => ({
        url: "/api/truefalse/bulk-add",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "TF", id: "LIST" }],
    }),
    bulkAddFillBlank: builder.mutation({
      query: (body) => ({
        url: "/api/fillblank/bulk-add",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "FB", id: "LIST" }],
    }),

    // ======= AUTH / PROFILE =======
    userDetail: builder.query({
      query: () => "/auth/userDetail",
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: "/auth/updateUser",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    signup: builder.mutation({
      query: (body) => ({ url: "/auth/signup", method: "POST", body }),
    }),
  }),
});

export const {
  // raw
  useGetMcqQuestionsQuery,
  useGetTrueFalseQuestionsQuery,
  useGetFillBlankQuestionsQuery,
  // category-scoped
  useGetMcqByCategoryQuery,
  useGetTFByCategoryQuery,
  useGetFBByCategoryQuery,
  // mutate
  useBulkAddMcqMutation,
  useBulkAddTrueFalseMutation,
  useBulkAddFillBlankMutation,
  // auth
  useUserDetailQuery,
  useUpdateUserMutation,
  useLoginMutation,
  useSignupMutation,
} = api;
