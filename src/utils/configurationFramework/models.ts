export enum ConfigurationItemVersionStatus
{
    /**
     * Version is still a work in progress
     */
    Draft = 1,

    /**
     * Configuration changes for this version have been completed but is awaiting to made live
     */
    Ready = 2,

    /**
     * Version is currently Live
     */
    Live = 3,

    /**
     * Version was set to ‘Ready’ but was decided that it should not go live
     */
    Cancelled = 4,

    /**
     * Version was previously Live but has been retired
     */
    Retired = 5,
}